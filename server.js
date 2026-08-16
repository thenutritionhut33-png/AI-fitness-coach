// FitCoach AI - Node backend server
// Serves static files AND proxies AI requests to Gemini/OpenAI.
// The user's API key is sent from the browser to this server (same origin)
// and used only to call the AI provider. It is never stored or logged here.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function serveStatic(req, res, pathname) {
  let filePath = path.join(ROOT, pathname);
  if (filePath === ROOT || filePath === path.join(ROOT, path.sep)) {
    filePath = path.join(ROOT, "index.html");
  }
  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-cache" });
    fs.createReadStream(filePath).pipe(res);
  });
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let data = "";
    req.on("data", function (chunk) {
      data += chunk;
      if (data.length > 1e7) req.destroy();
    });
    req.on("end", function () {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

async function handleAI(req, res) {
  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Invalid JSON body" }));
    return;
  }

  const provider = body.provider;
  const apiKey = (body.apiKey || "").trim();
  if (!apiKey) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "No API key configured" }));
    return;
  }

  try {
    if (provider === "gemini") {
      const result = await callGemini(body, apiKey);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } else if (provider === "openrouter") {
      const result = await callOpenAI(body, apiKey, "https://openrouter.ai/api/v1");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } else {
      const result = await callOpenAI(body, apiKey);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    }
  } catch (e) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Server error: " + e.message }));
  }
}

function buildSystemPrompt(coach) {
  return (
    "You are '" + (coach.name || "FitCoach") + "', an elite fitness coach on FitCoach AI. " +
    "Coach specialty: " + (coach.desc || "fitness coaching") + ". " +
    "Be energetic, specific, and practical. Use short paragraphs and bullet points. " +
    "You must include a short medical disclaimer whenever hormones, TRT, anabolic agents, medications, or supplements are discussed, and never prescribe dosages or encourage illegal substances. " +
    "Never provide medical diagnoses."
  );
}

async function callGemini(body, apiKey) {
  const model = body.apiModel || "gemini-2.0-flash";
  const base = "https://generativelanguage.googleapis.com/v1beta";
  const contents = [];
  (body.conversation || []).forEach(function (m) {
    const role = m.role === "user" ? "user" : "model";
    const prev = contents[contents.length - 1];
    if (prev && prev.role === role) {
      prev.parts.push({ text: m.text });
    } else {
      contents.push({ role: role, parts: [{ text: m.text }] });
    }
  });
  if (!contents.length) contents.push({ role: "user", parts: [{ text: "Hello" }] });

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemPrompt(body.coach || {}) }] },
    contents: contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
  };

  const res = await fetch(
    base + "/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const t = await safeErrorText(res);
    return { ok: false, error: "Gemini HTTP " + res.status + " - " + t };
  }
  const data = await res.json();
  const content = data.candidates && data.candidates[0] && data.candidates[0].content &&
    data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
  return content ? { ok: true, text: content } : { ok: false, error: "Empty Gemini response" };
}

async function callOpenAI(body, apiKey, defaultBase) {
  const base = (body.apiBase || defaultBase || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = body.apiModel || "gpt-4o-mini";
  const messages = [{ role: "system", content: buildSystemPrompt(body.coach || {}) }].concat(
    (body.conversation || []).map(function (m) {
      return { role: m.role === "user" ? "user" : "assistant", content: m.text };
    })
  );
  const res = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({ model: model, messages: messages, temperature: 0.7, max_tokens: 800 }),
  });
  if (!res.ok) {
    const t = await safeErrorText(res);
    return { ok: false, error: "OpenAI HTTP " + res.status + " - " + t };
  }
  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message.content;
  return content ? { ok: true, text: content } : { ok: false, error: "Empty response" };
}

async function safeErrorText(res) {
  try {
    const j = await res.json();
    return (j.error && (j.error.message || j.error.status)) || res.statusText;
  } catch (e) {
    return res.statusText;
  }
}

async function handleModels(req, res) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 15000);
    const r = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!r.ok) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "OpenRouter models fetch failed HTTP " + r.status }));
      return;
    }
    const data = await r.json();
    const free = (data.data || []).filter(function (m) {
      const p = m.pricing || {};
      return parseFloat(p.prompt || "inf") === 0 && parseFloat(p.completion || "inf") === 0;
    });
    const list = free.map(function (m) {
      return { id: m.id, name: (m.name || m.id).split("(")[0].trim() };
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, models: list }));
  } catch (e) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Models fetch error: " + e.message }));
  }
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost:" + PORT);
  const pathname = url.pathname;

  if (req.method === "POST" && pathname === "/api/llm") {
    handleAI(req, res);
    return;
  }

  if (pathname === "/api/models") {
    handleModels(req, res);
    return;
  }

  if (pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  serveStatic(req, res, pathname === "/" ? "/index.html" : pathname);
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("FitCoach AI server running at http://localhost:" + PORT);
});
