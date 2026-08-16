// FitCoach AI - App Engine
(function () {
  "use strict";

  const coaches = window.COACHES || [];
  let currentCoach = coaches[0];
  let currentChat = null;

  const els = {
    coachList: document.getElementById("coach-list"),
    coachName: document.getElementById("coach-name"),
    coachTagline: document.getElementById("coach-tagline"),
    coachAvatar: document.getElementById("coach-avatar"),
    messages: document.getElementById("messages"),
    typing: document.getElementById("typing"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    sendBtn: document.getElementById("send-btn"),
    aiStatus: document.getElementById("ai-status"),
    aiStatusText: document.getElementById("ai-status-text"),
    settingsBtn: document.getElementById("settings-btn"),
    resetBtn: document.getElementById("reset-btn"),
    modalOverlay: document.getElementById("modal-overlay"),
    disclaimerOverlay: document.getElementById("disclaimer-overlay"),
    modalClose: document.getElementById("modal-close"),
    disclaimerClose: document.getElementById("disclaimer-close"),
    disclaimerLink: document.getElementById("disclaimer-link"),
    saveSettings: document.getElementById("save-settings"),
    apiProvider: document.getElementById("api-provider"),
    apiKey: document.getElementById("api-key"),
    apiBase: document.getElementById("api-base"),
    apiModel: document.getElementById("api-model"),
    apiBaseLabel: document.getElementById("api-base-label"),
    modelOptions: document.getElementById("model-options"),
    refreshModels: document.getElementById("refresh-models"),
    testConnection: document.getElementById("test-connection"),
    testResult: document.getElementById("test-result"),
  };

  const STORAGE_KEY = "fitcoach_settings";
  const CHAT_KEY = "fitcoach_chat";

  // In-memory fallback for environments where localStorage is blocked (iframes/private mode).
  let memorySettings = null;

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return key === STORAGE_KEY ? memorySettings : null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      if (key === STORAGE_KEY) memorySettings = value;
      return false;
    }
  }

  function storageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) { /* ignore */ }
  }

  // ---------- Settings ----------
  function loadSettings() {
    try {
      return JSON.parse(storageGet(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function effectiveProvider(s) {
    if (s.provider) return s.provider;
    const k = s.apiKey || "";
    if (k.indexOf("AIza") === 0) return "gemini";
    if (k.indexOf("sk-or-") === 0) return "openrouter";
    return "openai";
  }

  function saveSettings() {
    const s = {
      provider: els.apiProvider.value,
      apiKey: els.apiKey.value.trim(),
      apiBase: els.apiBase.value.trim(),
      apiModel: els.apiModel.value.trim(),
    };
    storageSet(STORAGE_KEY, JSON.stringify(s));
    updateStatus();
  }

  function updateStatus() {
    const s = loadSettings();
    const hasLLM = !!s.apiKey;
    const provider = effectiveProvider(s);
    const label = provider === "gemini" ? "Gemini AI" : provider === "openrouter" ? "OpenRouter AI" : "AI mode";
    els.aiStatus.classList.toggle("llm", hasLLM);
    els.aiStatusText.textContent = hasLLM ? label + " (" + (s.apiModel || "custom") + ")" : "Knowledge base mode";
  }

  // ---------- Render helpers ----------
  function formatText(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }

  function createAvatar(short, color) {
    const a = document.createElement("div");
    a.className = "avatar";
    a.style.background = color;
    a.textContent = short;
    return a;
  }

  function addMessage(role, text, avatar, color) {
    const wrap = document.createElement("div");
    wrap.className = "message " + role;

    if (role === "bot") {
      wrap.appendChild(createAvatar(avatar, color));
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = formatText(text);
    wrap.appendChild(bubble);

    if (role === "user") {
      wrap.appendChild(createAvatar("YOU", "#22c55e"));
    }

    els.messages.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function scrollBottom() {
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function showTyping() {
    els.typing.classList.remove("hidden");
    els.sendBtn.disabled = true;
    scrollBottom();
  }

  function hideTyping() {
    els.typing.classList.add("hidden");
    els.sendBtn.disabled = false;
  }

  // ---------- Coach rendering ----------
  function renderCoachList() {
    els.coachList.innerHTML = "";
    coaches.forEach(function (coach) {
      const li = document.createElement("li");
      li.className = "coach-item" + (coach.id === currentCoach.id ? " active" : "");
      li.dataset.id = coach.id;

      const av = document.createElement("div");
      av.className = "coach-avatar";
      av.style.background = coach.color;
      av.textContent = coach.avatar;

      const info = document.createElement("div");
      const name = document.createElement("div");
      name.className = "coach-name";
      name.textContent = coach.name;
      const desc = document.createElement("div");
      desc.className = "coach-desc";
      desc.textContent = coach.desc;
      info.appendChild(name);
      info.appendChild(desc);

      li.appendChild(av);
      li.appendChild(info);
      li.addEventListener("click", function () {
        switchCoach(coach.id);
      });
      els.coachList.appendChild(li);
    });
  }

  function switchCoach(id) {
    const coach = coaches.find(function (c) { return c.id === id; });
    if (!coach || coach.id === currentCoach.id) return;
    currentCoach = coach;
    renderCoachList();
    els.coachName.textContent = coach.name;
    els.coachTagline.textContent = coach.tagline;
    els.coachAvatar.textContent = coach.avatar;
    els.coachAvatar.style.background = coach.color;
    addMessage("bot", coach.greeting, coach.avatar, coach.color);
    persistChat();
  }

  // ---------- Response engine ----------
  function scoreIntent(message, intent) {
    let score = 0;
    const msg = message.toLowerCase();
    intent.keywords.forEach(function (kw) {
      if (msg.indexOf(kw) >= 0) score += kw.length;
    });
    return score;
  }

  function knowledgeResponse(message, coach) {
    let best = null;
    let bestScore = 0;
    coach.intents.forEach(function (intent) {
      const s = scoreIntent(message, intent);
      if (s > bestScore) {
        best = intent;
        bestScore = s;
      }
    });
    return best;
  }

  // ---------- LLM integration (optional, user-provided key) ----------
  function buildSystemPrompt(coach) {
    return (
      "You are '" + coach.name + "', an elite fitness coach on FitCoach AI. " +
      "Coach specialty: " + coach.desc + ". " +
      "Be energetic, specific, and practical. Use short paragraphs and bullet points. " +
      "You must include a short medical disclaimer whenever hormones, TRT, anabolic agents, medications, or supplements are discussed, and never prescribe dosages or encourage illegal substances. " +
      "Never provide medical diagnoses."
    );
  }

  async function callOpenAI(conversation, coach, s) {
    const base = (s.apiBase || "https://api.openai.com/v1").replace(/\/+$/, "");
    const model = s.apiModel || "gpt-4o-mini";
    const messages = [{ role: "system", content: buildSystemPrompt(coach) }].concat(conversation.map(function (m) {
      return { role: m.role === "user" ? "user" : "assistant", content: m.text };
    }));

    try {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 30000);
      const res = await fetch(base + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + s.apiKey,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        return { ok: false, error: "HTTP " + res.status + " - " + (await safeErrorText(res)) };
      }
      const data = await res.json();
      const content = data.choices && data.choices[0] && data.choices[0].message.content;
      return content ? { ok: true, text: content } : { ok: false, error: "Empty response" };
    } catch (e) {
      return { ok: false, error: "Network error: " + e.message };
    }
  }

  async function safeErrorText(res) {
    try {
      const j = await res.json();
      return (j.error && (j.error.message || j.error.status)) || res.statusText;
    } catch (e) {
      return res.statusText;
    }
  }

  async function callGemini(conversation, coach, s) {
    const model = s.apiModel || "gemini-2.0-flash";
    const base = "https://generativelanguage.googleapis.com/v1beta";

    const contents = [];
    conversation.forEach(function (m) {
      const role = m.role === "user" ? "user" : "model";
      const prev = contents[contents.length - 1];
      if (prev && prev.role === role) {
        prev.parts.push({ text: m.text });
      } else {
        contents.push({ role: role, parts: [{ text: m.text }] });
      }
    });
    if (!contents.length) {
      contents.push({ role: "user", parts: [{ text: "Hello" }] });
    }

    const payload = {
      systemInstruction: { parts: [{ text: buildSystemPrompt(coach) }] },
      contents: contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    };

    try {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 30000);
      const res = await fetch(
        base + "/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(s.apiKey),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );
      clearTimeout(timer);
      if (!res.ok) {
        return { ok: false, error: "HTTP " + res.status + " - " + (await safeErrorText(res)) };
      }
      const data = await res.json();
      const content =
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;
      return content ? { ok: true, text: content } : { ok: false, error: "Empty response" };
    } catch (e) {
      return { ok: false, error: "Network error: " + e.message };
    }
  }

  async function callLLM(conversation, coach) {
    const s = loadSettings();
    if (!s.apiKey) return null;
    const provider = effectiveProvider(s);
    const apiBase = provider === "openrouter" ? "https://openrouter.ai/api/v1" : s.apiBase;

    // Prefer the same-origin backend proxy (no CORS issues, key never exposed).
    try {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 35000);
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: provider,
          apiKey: s.apiKey,
          apiBase: apiBase,
          apiModel: s.apiModel,
          conversation: conversation,
          coach: { name: coach.name, desc: coach.desc },
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.ok === "boolean") {
          if (data.ok) return { ok: true, text: data.text };
          return { ok: false, error: data.error || "Proxy error" };
        }
      }
    } catch (e) {
      // fall through to browser-direct call
    }

    // Fallback: call provider directly from the browser (works if served statically).
    if (provider === "gemini") {
      return callGemini(conversation, coach, s);
    }
    return callOpenAI(conversation, coach, { apiKey: s.apiKey, apiBase: apiBase, apiModel: s.apiModel });
  }

  // ---------- Chat flow ----------
  function handleSend() {
    const text = els.chatInput.value.trim();
    if (!text) return;

    els.chatInput.value = "";
    resizeInput();
    addMessage("user", text, null, null);
    showTyping();

    const conv = currentChat || [];
    conv.push({ role: "user", text: text });

    callLLM(conv, currentCoach).then(function (llmAnswer) {
      let reply;
      let note = null;
      if (llmAnswer && llmAnswer.ok) {
        reply = llmAnswer.text;
      } else if (llmAnswer && !llmAnswer.ok) {
        reply = "**AI ERROR - connection failed.**\n\n" +
          "Provider returned: `" + llmAnswer.error + "`\n\n" +
          "Fix options:\n" +
          "- Check your API key is correct and active (AI Settings → Test AI connection)\n" +
          "- For OpenRouter pick a model like `openrouter/free` or any `:free` model\n" +
          "- For Gemini check the model name is valid\n\n" +
          "Meanwhile, here's what " + currentCoach.name + " says from the built-in knowledge base:";
        const kb = knowledgeResponse(text, currentCoach);
        if (kb) {
          reply += "\n\n" + kb.response;
        }
      } else {
        const kb = knowledgeResponse(text, currentCoach);
        reply = kb ? kb.response : defaultReply(text);
      }
      hideTyping();
      addMessage("bot", reply, currentCoach.avatar, currentCoach.color);
      conv.push({ role: "bot", text: reply });
      currentChat = conv;
      persistChat();
      scrollBottom();
    });
  }

  function defaultReply(text) {
    const s = loadSettings();
    if (!s.apiKey) {
      return "**AI not configured yet.** I could only search my built-in knowledge base and found nothing specific for \"" + text + "\".\n\n" +
        "To unlock full AI answers:\n" +
        "1. Click **AI Settings** (left sidebar)\n" +
        "2. Select **OpenRouter** (free) or **Gemini**\n" +
        "3. Paste your API key\n" +
        "4. Click **Save settings**, then **Test AI connection**\n\n" +
        "After that, ask me again!";
    }
    return "Great question. Here's my coaching take on \"" + text + "\":\n\n" +
      "For a fully tailored answer, give me more specifics: your **experience level**, **goal**, **training days**, and any **limitations**. " +
      "That lets me build a plan specific to you rather than general advice.";
  }

  // ---------- Chat persistence ----------
  function persistChat() {
    try {
      const data = {
        coachId: currentCoach.id,
        messages: Array.from(els.messages.children).map(function (el) {
          const role = el.classList.contains("user") ? "user" : "bot";
          const bubble = el.querySelector(".bubble");
          const avatar = el.querySelector(".avatar");
          const isUser = role === "user";
          const color = isUser ? "#22c55e" : currentCoach.color;
          const initial = isUser ? "YOU" : currentCoach.avatar;
          void color;
          void initial;
          return { role: role, text: bubble ? bubble.textContent : "" };
        }),
      };
      storageSet(CHAT_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function restoreChat() {
    try {
      const data = JSON.parse(storageGet(CHAT_KEY));
      if (!data) return;
      const coach = coaches.find(function (c) { return c.id === data.coachId; });
      if (coach) currentCoach = coach;
      renderCoachList();
      els.coachName.textContent = currentCoach.name;
      els.coachTagline.textContent = currentCoach.tagline;
      els.coachAvatar.textContent = currentCoach.avatar;
      els.coachAvatar.style.background = currentCoach.color;

      if (data.messages && data.messages.length) {
        data.messages.forEach(function (m) {
          addMessage(m.role, m.text, currentCoach.avatar, currentCoach.color);
        });
      } else {
        addMessage("bot", currentCoach.greeting, currentCoach.avatar, currentCoach.color);
      }
      const userCount = data.messages ? data.messages.filter(function (m) { return m.role === "user"; }).length : 0;
      const botMsgs = data.messages ? data.messages.filter(function (m) { return m.role === "bot"; }) : [];
      currentChat = botMsgs.map(function (m) { return { role: "bot", text: m.text }; }).slice(0, userCount);
    } catch (e) {
      addMessage("bot", currentCoach.greeting, currentCoach.avatar, currentCoach.color);
    }
  }

  function resetChat() {
    storageRemove(CHAT_KEY);
    currentChat = null;
    els.messages.innerHTML = "";
    addMessage("bot", currentCoach.greeting, currentCoach.avatar, currentCoach.color);
  }

  // ---------- Textarea auto-resize ----------
  function resizeInput() {
    els.chatInput.style.height = "auto";
    els.chatInput.style.height = Math.min(els.chatInput.scrollHeight, 140) + "px";
  }

  // ---------- Modal ----------
  function openModal() {
    const s = loadSettings();
    const provider = effectiveProvider(s);
    els.apiProvider.value = provider;
    els.apiKey.value = s.apiKey || "";
    els.apiBase.value = s.apiBase || "";
    els.apiModel.value = s.apiModel || "";
    toggleProviderFields(provider);
    els.modalOverlay.classList.remove("hidden");
    if (provider === "openrouter") {
      loadFreeModels();
    } else {
      populateModelOptions(provider);
    }
  }

  function toggleBaseField(provider) {
    const show = provider !== "gemini";
    els.apiBase.style.display = show ? "" : "none";
    els.apiBaseLabel.style.display = show ? "" : "none";
  }

  function toggleProviderFields(provider) {
    toggleBaseField(provider);
    els.refreshModels.classList.toggle("hidden", provider !== "openrouter");
    if (provider !== "openrouter") {
      els.apiModel.placeholder = provider === "gemini" ? "gemini-2.0-flash" : "gpt-4o-mini";
    }
  }

  const MODEL_SUGGESTIONS = {
    gemini: ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"],
    openai: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
  };

  function populateModelOptions(provider) {
    const list = els.modelOptions;
    list.innerHTML = "";
    const suggestions = MODEL_SUGGESTIONS[provider] || [];
    suggestions.forEach(function (m) {
      const opt = document.createElement("option");
      opt.value = m;
      list.appendChild(opt);
    });
  }

  async function loadFreeModels() {
    const btn = els.refreshModels;
    btn.textContent = "Loading free models...";
    btn.disabled = true;
    try {
      const controller = new AbortController();
      const timer = setTimeout(function () { controller.abort(); }, 15000);
      const res = await fetch("/api/models", { signal: controller.signal });
      clearTimeout(timer);
      const data = await res.json();
      if (data.ok && data.models && data.models.length) {
        els.modelOptions.innerHTML = "";
        data.models.forEach(function (m) {
          const opt = document.createElement("option");
          opt.value = m.id;
          opt.textContent = m.id + " (" + m.name + ")";
          els.modelOptions.appendChild(opt);
        });
        btn.textContent = "Loaded " + data.models.length + " free models";
      } else {
        btn.textContent = "Failed to load - click to retry";
      }
    } catch (e) {
      btn.textContent = "Failed to load - click to retry";
    } finally {
      btn.disabled = false;
      setTimeout(function () {
        btn.textContent = "Refresh free models from OpenRouter";
      }, 4000);
    }
  }

  async function testConnection() {
    const s = loadSettings();
    const btn = els.testConnection;
    const out = els.testResult;
    if (!s.apiKey) {
      out.textContent = "No API key saved. Paste your key above and click Save settings first.";
      out.className = "test-result error";
      return;
    }
    btn.textContent = "Testing...";
    btn.disabled = true;
    out.textContent = "Sending test message...";
    out.className = "test-result";
    try {
      const result = await callLLM(
        [{ role: "user", text: "Reply with exactly: CONNECTION_OK" }],
        currentCoach
      );
      if (result && result.ok) {
        out.textContent = "SUCCESS - AI replied: " + result.text.slice(0, 80);
        out.className = "test-result success";
      } else if (result && !result.ok) {
        out.textContent = "FAILED - " + result.error;
        out.className = "test-result error";
      } else {
        out.textContent = "FAILED - no AI response (key may not be saved / AI not configured).";
        out.className = "test-result error";
      }
    } catch (e) {
      out.textContent = "FAILED - " + e.message;
      out.className = "test-result error";
    } finally {
      btn.textContent = "Test AI connection";
      btn.disabled = false;
    }
  }

  function closeModal() {
    els.modalOverlay.classList.add("hidden");
  }

  function openDisclaimer() {
    els.disclaimerOverlay.classList.remove("hidden");
  }

  function closeDisclaimer() {
    els.disclaimerOverlay.classList.add("hidden");
  }

  // ---------- Events ----------
  els.chatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSend();
  });

  els.chatInput.addEventListener("input", resizeInput);
  els.chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  els.settingsBtn.addEventListener("click", openModal);
  els.modalClose.addEventListener("click", closeModal);
  els.disclaimerClose.addEventListener("click", closeDisclaimer);
  els.disclaimerLink.addEventListener("click", openDisclaimer);
  els.resetBtn.addEventListener("click", resetChat);
  els.apiProvider.addEventListener("change", function () {
    const provider = els.apiProvider.value;
    toggleProviderFields(provider);
    if (provider === "openrouter") {
      loadFreeModels();
    } else {
      populateModelOptions(provider);
    }
    if (provider === "gemini" && !els.apiModel.value.trim()) {
      els.apiModel.value = "gemini-2.0-flash";
    } else if (provider === "openai" && !els.apiModel.value.trim()) {
      els.apiModel.value = "gpt-4o-mini";
    } else if (provider === "openrouter" && !els.apiModel.value.trim()) {
      els.apiModel.value = "openrouter/free";
    }
  });
  els.refreshModels.addEventListener("click", loadFreeModels);
  els.testConnection.addEventListener("click", testConnection);
  els.saveSettings.addEventListener("click", function () {
    const hadKey = !!(loadSettings().apiKey || "");
    saveSettings();
    closeModal();
    const s = loadSettings();
    if (!s.apiKey) {
      showToast("Settings saved. No API key set - AI mode is off.", "warn");
    } else if (!hadKey) {
      showToast("API key saved. AI mode is ON!", "ok");
    } else {
      showToast("Settings saved.", "ok");
    }
  });

  document.querySelectorAll(".quick-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      els.chatInput.value = btn.dataset.prompt;
      handleSend();
    });
  });

  // Close modals on overlay click
  els.modalOverlay.addEventListener("click", function (e) {
    if (e.target === els.modalOverlay) closeModal();
  });
  els.disclaimerOverlay.addEventListener("click", function (e) {
    if (e.target === els.disclaimerOverlay) closeDisclaimer();
  });

  function showToast(msg, type) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = "toast " + (type || "");
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 3500);
  }

  // ---------- Init ----------
  updateStatus();
  restoreChat();
  scrollBottom();
  els.chatInput.focus();
})();
