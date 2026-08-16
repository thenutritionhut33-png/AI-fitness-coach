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
  };

  const STORAGE_KEY = "fitcoach_settings";
  const CHAT_KEY = "fitcoach_chat";

  // ---------- Settings ----------
  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function effectiveProvider(s) {
    if (s.provider) return s.provider;
    if (s.apiKey && s.apiKey.trim().indexOf("AIza") === 0) return "gemini";
    return "openai";
  }

  function saveSettings() {
    const s = {
      provider: els.apiProvider.value,
      apiKey: els.apiKey.value.trim(),
      apiBase: els.apiBase.value.trim(),
      apiModel: els.apiModel.value.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    updateStatus();
  }

  function updateStatus() {
    const s = loadSettings();
    const hasLLM = !!s.apiKey;
    const provider = effectiveProvider(s);
    const label = provider === "gemini" ? "Gemini AI" : "AI mode";
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
      if (!res.ok) return null;
      const data = await res.json();
      const content = data.choices && data.choices[0] && data.choices[0].message.content;
      return content || null;
    } catch (e) {
      return null;
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
      if (!res.ok) return null;
      const data = await res.json();
      const content =
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;
      return content || null;
    } catch (e) {
      return null;
    }
  }

  async function callLLM(conversation, coach) {
    const s = loadSettings();
    if (!s.apiKey) return null;
    const provider = effectiveProvider(s);
    if (provider === "gemini") {
      return callGemini(conversation, coach, s);
    }
    return callOpenAI(conversation, coach, s);
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
      if (llmAnswer) {
        reply = llmAnswer;
      } else {
        const kb = knowledgeResponse(text, currentCoach);
        if (kb) {
          reply = kb.response;
        } else {
          reply = defaultReply(text);
        }
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
    const llmHint = s.apiKey
      ? ""
      : "\n\n**Tip:** Connect your own AI API key in Settings for deeper answers from " + currentCoach.name + ".";
    return "Great question. Here's my coaching take on \"" + text + "\":\n\n" +
      "For a fully tailored answer, give me more specifics: your **experience level**, **goal**, **training days**, and any **limitations**. " +
      "That lets me build a plan specific to you rather than general advice." +
      llmHint;
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
      localStorage.setItem(CHAT_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function restoreChat() {
    try {
      const data = JSON.parse(localStorage.getItem(CHAT_KEY));
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
    localStorage.removeItem(CHAT_KEY);
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
    toggleBaseField(provider);
    els.modalOverlay.classList.remove("hidden");
  }

  function toggleBaseField(provider) {
    const show = provider !== "gemini";
    els.apiBase.style.display = show ? "" : "none";
    els.apiBaseLabel.style.display = show ? "" : "none";
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
    toggleBaseField(provider);
    if (provider === "gemini" && !els.apiModel.value.trim()) {
      els.apiModel.value = "gemini-2.0-flash";
    } else if (provider === "openai" && !els.apiModel.value.trim()) {
      els.apiModel.value = "gpt-4o-mini";
    }
  });
  els.saveSettings.addEventListener("click", function () {
    saveSettings();
    closeModal();
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

  // ---------- Init ----------
  updateStatus();
  restoreChat();
  scrollBottom();
  els.chatInput.focus();
})();
