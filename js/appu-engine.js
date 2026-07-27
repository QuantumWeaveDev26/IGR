/**
 * APPU AI Chat Engine & Persona System
 * Inspired by the warmth, encouragement, and educational passion of late Dr. Puneeth Rajkumar.
 * Handles onboarding guardrails, adaptive prompt mutation, intent parsing, and n8n WhatsApp integrations.
 */

class APPUChatEngine {
  constructor() {
    this.session = {
      name: localStorage.getItem('appu_user_name') || '',
      role: localStorage.getItem('appu_user_role') || 'Student', // 'Student' or 'Parent'
      phone: localStorage.getItem('appu_user_phone') || '',
      grade: localStorage.getItem('appu_user_grade') || 'Class 10',
      isOnboarded: false
    };

    this.session.isOnboarded = !!(this.session.name && this.session.phone);
    this.onboardingStep = 0;
    this.pendingQuery = null;

    this.isOpen = false;
    this.unreadCount = 1;

    // Gamification & Voice state
    this.xp = parseInt(localStorage.getItem('appu_xp')) || 350;
    this.streak = parseInt(localStorage.getItem('appu_streak')) || 3;
    this.voiceEnabled = localStorage.getItem('appu_voice_muted') !== 'true';

    this.initDOM();
    this.updateRoleUI();
    this.updateXPUI();
  }

  initDOM() {
    this.elements = {
      container: document.getElementById('appuWidgetContainer'),
      floatBubble: document.getElementById('appuFloatBubble'),
      chatWindow: document.getElementById('appuChatWindow'),
      chatBody: document.getElementById('chatBody'),
      chatInput: document.getElementById('chatInput'),
      sendBtn: document.getElementById('sendChatBtn'),
      closeBtn: document.getElementById('closeChatBtn'),
      roleToggleBtn: document.getElementById('roleToggleBtn'),
      voiceToggleBtn: document.getElementById('voiceToggleBtn'),
      roleBadge: document.getElementById('roleBadgeIndicator'),
      unreadBadge: document.getElementById('unreadBadge'),
      suggestedChips: document.getElementById('suggestedChips')
    };

    if (!this.elements.floatBubble) return;

    this.elements.floatBubble.addEventListener('click', () => this.toggleChat());
    this.elements.closeBtn.addEventListener('click', () => this.toggleChat(false));
    this.elements.sendBtn.addEventListener('click', () => this.handleUserSubmit());
    
    this.elements.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleUserSubmit();
    });

    this.elements.roleToggleBtn.addEventListener('click', () => this.switchRole());

    if (this.elements.voiceToggleBtn) {
      this.elements.voiceToggleBtn.addEventListener('click', () => this.toggleVoice());
      this.elements.voiceToggleBtn.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }

    // Initial APPU Greeting
    setTimeout(() => {
      if (this.elements.chatBody.children.length <= 1) {
        this.renderInitialGreeting();
      }
    }, 400);
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    localStorage.setItem('appu_voice_muted', (!this.voiceEnabled).toString());
    if (this.elements.voiceToggleBtn) {
      this.elements.voiceToggleBtn.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }
    if (!this.voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  updateXPUI() {
    const xpEl = document.getElementById('xpCount');
    const streakEl = document.getElementById('streakCount');
    const fillEl = document.getElementById('xpBarFill');

    if (xpEl) xpEl.textContent = this.xp;
    if (streakEl) streakEl.textContent = this.streak;
    if (fillEl) {
      const pct = Math.min(100, (this.xp % 500) / 5);
      fillEl.style.width = `${pct}%`;
    }
  }

  addXP(amount, targetEl) {
    this.xp += amount;
    localStorage.setItem('appu_xp', this.xp);
    this.updateXPUI();

    // Floating XP Animation
    const popup = document.createElement('div');
    popup.className = 'xp-popup-float';
    popup.textContent = `+${amount} XP 🌟`;

    const chatWindow = this.elements.chatWindow;
    if (chatWindow) {
      popup.style.top = '100px';
      popup.style.right = '40px';
      chatWindow.appendChild(popup);
      setTimeout(() => popup.remove(), 1200);
    }

    this.triggerConfetti();
  }

  triggerConfetti() {
    const canvas = document.getElementById('chatConfettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const particles = [];
    const colors = ['#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.7) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.opacity > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.opacity -= 0.025;
          p.rotation += p.rSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && frame < 60) {
        frame++;
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();
  }

  speakText(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[*_#`~|]/g, '')
      .replace(/http\S+/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 200));
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    const speakingWave = document.getElementById('speakingWave');
    const avatarImg = document.getElementById('miniAppuAvatar');

    utterance.onstart = () => {
      if (speakingWave) speakingWave.classList.add('active');
      if (avatarImg) avatarImg.classList.add('speaking');
    };

    utterance.onend = utterance.onerror = () => {
      if (speakingWave) speakingWave.classList.remove('active');
      if (avatarImg) avatarImg.classList.remove('speaking');
    };

    window.speechSynthesis.speak(utterance);
  }

  toggleChat(forceState) {
    this.isOpen = typeof forceState === 'boolean' ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.elements.chatWindow.classList.add('open');
      this.elements.unreadBadge.style.display = 'none';
      this.unreadCount = 0;
      this.elements.chatInput.focus();
    } else {
      this.elements.chatWindow.classList.remove('open');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }

  switchRole() {
    this.session.role = this.session.role === 'Student' ? 'Parent' : 'Student';
    localStorage.setItem('appu_user_role', this.session.role);
    this.updateRoleUI();

    const roleMsg = this.session.role === 'Student' 
      ? "🌟 Switched to **Student Persona Mode**! I'm ready with fun stories, quick interactive quests, and step-by-step CBSE mastery! What shall we learn today?"
      : "📊 Switched to **Parent Growth Mode**! I can share structural insights, screen-time reduction strategies, and 40-hour foundation metrics for your child. How can I assist you?";

    this.addAPPUMessage(roleMsg);
  }

  updateRoleUI() {
    const isStudent = this.session.role === 'Student';
    this.elements.roleBadge.textContent = isStudent ? '🎓 Student Mode' : '📊 Parent Mode';
    this.elements.roleBadge.className = isStudent ? 'role-tag-indicator' : 'role-tag-indicator parent-mode';

    const chips = isStudent ? [
      "🎮 2-Min Micro-Quest",
      "🃏 3D Concept Flashcard",
      "🔬 Interactive Ray Diagram",
      "📚 Class 10 Science Syllabus"
    ] : [
      "📈 How does APPU boost marks by 30-50%?",
      "📱 How do we reduce screen time?",
      "📚 Class 10 Science Syllabus"
    ];

    this.elements.suggestedChips.innerHTML = chips.map(chip => `
      <button class="chip-btn" onclick="window.appuEngine.handleChipClick('${chip.replace(/'/g, "\\'")}')">${chip}</button>
    `).join('');
  }

  renderInitialGreeting() {
    let text = "";
    if (this.session.isOnboarded) {
      text = `Namaste ${this.session.name}! 🙏 Appu is so happy to see you back! As a ${this.session.role}, what high school goal or CBSE topic are we conquering today? Remember, every effort you make brings you closer to your dreams! ✨`;
    } else {
      text = `Namaste! 🙏 I'm **APPU**—your personal AI learning companion inspired by love, warmth, and passion for education! Before we start exploring CBSE concepts or syllabus guides, may I know your good name and whether you're a Student or a Parent? 🌟`;
    }

    this.addAPPUMessage(text);
  }

  handleChipClick(text) {
    this.elements.chatInput.value = text.replace(/^[^\w]+/, '').trim();
    this.handleUserSubmit();
  }

  handleUserSubmit() {
    const text = this.elements.chatInput.value.trim();
    if (!text) return;

    this.addUserMessage(text);
    this.elements.chatInput.value = '';

    // Check Onboarding Guardrail
    if (!this.session.isOnboarded) {
      this.pendingQuery = text;
      this.triggerOnboardingFlow(text);
      return;
    }

    // Process Message
    this.processQuery(text);
  }

  triggerOnboardingFlow(userMessage) {
    if (this.onboardingStep === 0) {
      this.addAPPUMessage(`I'd love to help you with that! 😊 To personalize your learning insights and deliver study materials straight to your WhatsApp, let's complete a 5-second check-in!`);
      
      this.renderOnboardingCard();
      this.onboardingStep = 1;
    }
  }

  renderOnboardingCard() {
    const cardHtml = `
      <div class="onboarding-card" id="onboardingCard">
        <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--accent-gold);">
          📋 Quick 5-Second Onboarding
        </div>
        <label>Your Name</label>
        <input type="text" id="obName" placeholder="e.g., Ananya Sharma" value="${this.session.name}">

        <label>I am a:</label>
        <select id="obRole">
          <option value="Student" ${this.session.role === 'Student' ? 'selected' : ''}>Student (Grade 6-12)</option>
          <option value="Parent" ${this.session.role === 'Parent' ? 'selected' : ''}>Parent</option>
        </select>

        <label>WhatsApp Number (for syllabus & insights)</label>
        <input type="tel" id="obPhone" placeholder="e.g., 9876543210" value="${this.session.phone}">

        <button class="btn btn-gold" style="width: 100%; padding: 0.6rem; margin-top: 0.5rem; font-size: 0.88rem;" onclick="window.appuEngine.completeOnboarding()">
          🚀 Save & Continue
        </button>
      </div>
    `;

    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `
      <div class="chat-bubble-content" style="width: 100%;">
        ${cardHtml}
      </div>
    `;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  async completeOnboarding() {
    const nameInput = document.getElementById('obName');
    const roleInput = document.getElementById('obRole');
    const phoneInput = document.getElementById('obPhone');

    if (!nameInput || !phoneInput) return;

    const name = nameInput.value.trim();
    const role = roleInput.value;
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
      alert("Please provide your name and WhatsApp number to continue!");
      return;
    }

    this.session.name = name;
    this.session.role = role;
    this.session.phone = phone;
    this.session.isOnboarded = true;

    localStorage.setItem('appu_user_name', name);
    localStorage.setItem('appu_user_role', role);
    localStorage.setItem('appu_user_phone', phone);

    this.updateRoleUI();

    // Trigger n8n Data Ingestion Workflow
    const leadPayload = {
      user_name: name,
      user_role: role,
      user_phone: phone,
      grade: this.session.grade,
      source: 'APPU_Chat_Widget_LandingPage',
      timestamp: new Date().toISOString()
    };

    const n8nResult = await window.n8nClient.submitLeadCapture(leadPayload);

    // Remove onboarding card UI
    const cardEl = document.getElementById('onboardingCard');
    if (cardEl) cardEl.parentElement.innerHTML = `✅ *Thank you ${name}! Your profile is saved and registered with Appu.*`;

    this.addAPPUMessage(`Wonderful, ${name}! 🎉 You're all set! Now let me answer your query with full personalized insights.`);

    if (this.pendingQuery) {
      const q = this.pendingQuery;
      this.pendingQuery = null;
      setTimeout(() => this.processQuery(q), 500);
    }
  }

  async processQuery(text) {
    const qLower = text.toLowerCase();

    // 1. Explicit WhatsApp Syllabus Request Intent
    if (qLower.includes('send syllabus') || qLower.includes('whatsapp syllabus') || (qLower.includes('syllabus') && qLower.includes('whatsapp'))) {
      await this.handleWhatsAppSyllabusIntent(text);
      return;
    }

    // 2. Explicit Schedule Reminders Intent
    if (qLower.includes('schedule reminder') || qLower.includes('set reminder') || qLower.includes('remind me') || (qLower.includes('schedule') && qLower.includes('reminder'))) {
      await this.handleStudyScheduleIntent(text);
      return;
    }

    // 3. 15-Min Gamified Micro-Quest Intent
    if (qLower.includes('quest') || qLower.includes('gamified') || qLower.includes('challenge') || qLower.includes('2-min')) {
      this.handleGamifiedQuestIntent();
      return;
    }

    // 4. 3D Concept Flashcard Intent
    if (qLower.includes('flashcard') || qLower.includes('3d') || qLower.includes('concept card')) {
      this.handle3DFlashcardIntent();
      return;
    }

    // 5. Interactive Ray Diagram / Physics Visualizer Intent
    if (qLower.includes('ray diagram') || qLower.includes('optics') || qLower.includes('mirror') || qLower.includes('diagram') || qLower.includes('visual')) {
      this.handleRayDiagramIntent();
      return;
    }

    // 6. Automated Diagnostic Weak-Spot Radar Intent
    if (qLower.includes('weak spot') || qLower.includes('radar') || qLower.includes('remediation') || qLower.includes('concept gap')) {
      this.triggerWeakSpotRadar();
      return;
    }

    // 7. Sunday Parent Weekly Progress Digest Intent
    if (qLower.includes('digest') || qLower.includes('weekly report') || qLower.includes('parent report') || qLower.includes('trajectory')) {
      this.triggerParentWeeklyDigest();
      return;
    }

    // 8. Adaptive n8n AI Agent Response (General queries)
    await this.handleAdaptiveAIResponse(text);
  }

  handleGamifiedQuestIntent() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      this.renderInteractiveQuizCard({
        title: "Light & Reflection (Class 10)",
        question: "⚡ Question 1: If the angle of incidence on a mirror is 35°, what is the angle of reflection?",
        options: ["A) 35° (Equal Angle of Reflection)", "B) 55° (Complementary Angle)", "C) 70° (Double Angle)"],
        correctIndex: 0,
        explanation: "According to the **First Law of Reflection**, Angle of Incidence (∠i) is ALWAYS equal to Angle of Reflection (∠r). Therefore, ∠r = 35°! 🎯"
      });
    }, 400);
  }

  handle3DFlashcardIntent() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      this.renderFlipFlashcard(
        "⚡ Physics Challenge:\nWhy do stars twinkle at night?",
        "✨ **Atmospheric Refraction!** Light from stars continuously bends as it passes through Earth's atmosphere layers of varying temperature and optical density!",
        "Click Card to Flip 🔄 (+20 XP)"
      );
    }, 400);
  }

  handleRayDiagramIntent() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      this.renderRayDiagramVisualizer();
    }, 400);
  }

  renderInteractiveQuizCard({ title, question, options, correctIndex, explanation }) {
    const cardId = 'quiz_' + Date.now();
    const cardHtml = `
      <div class="interactive-quiz-card" id="${cardId}">
        <div class="quiz-card-header">
          <span>🎮 APPU MICRO-QUEST (+50 XP)</span>
          <span>${title}</span>
        </div>
        <div class="quiz-question-text">${question}</div>
        <div class="quiz-options-group">
          ${options.map((opt, i) => `
            <button class="quiz-option-btn" onclick="window.appuEngine.handleQuizAnswer('${cardId}', ${i}, ${correctIndex}, '${encodeURIComponent(explanation)}')">
              <span>${opt}</span>
              <span class="quiz-status-icon">➔</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `<img src="images/appu_portrait.jpg" alt="APPU" class="chat-msg-avatar"><div class="chat-bubble-content" style="background: transparent; padding: 0; width: 100%;">${cardHtml}</div>`;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();

    this.speakText(`Here is a quick APPU Micro Quest! ${question.replace(/⚡/g, '')}`);
  }

  handleQuizAnswer(cardId, selectedIndex, correctIndex, encodedExplanation) {
    const card = document.getElementById(cardId);
    if (!card || card.classList.contains('answered')) return;
    card.classList.add('answered');

    const options = card.querySelectorAll('.quiz-option-btn');
    const explanation = decodeURIComponent(encodedExplanation);

    options.forEach((btn, i) => {
      btn.style.pointerEvents = 'none';
      if (i === correctIndex) {
        btn.classList.add('correct');
        btn.querySelector('.quiz-status-icon').textContent = '✓ Correct';
      } else if (i === selectedIndex) {
        btn.classList.add('incorrect');
        btn.querySelector('.quiz-status-icon').textContent = '✗';
      }
    });

    if (selectedIndex === correctIndex) {
      this.addXP(50, card);
      this.addAPPUMessage(`🎉 **Brilliant Job!** You nailed it! 🌟\n\n${explanation}`);
      this.speakText(`Brilliant Job! You nailed it! ${explanation}`);
    } else {
      this.addXP(15, card);
      this.addAPPUMessage(`Great effort! 🌟 Let's learn from this:\n\n${explanation}`);
      this.speakText(`Great effort! ${explanation}`);
    }
  }

  renderFlipFlashcard(frontText, backText, hint = "Click Card to Flip 🔄 (+20 XP)") {
    const cardId = 'flash_' + Date.now();
    const html = `
      <div class="flashcard-container" id="${cardId}" onclick="this.classList.toggle('flipped'); window.appuEngine.addXP(20, this);">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div style="font-weight: 800; font-size: 0.8rem; text-transform: uppercase; opacity: 0.9;">🃏 Concept Flashcard</div>
            <div style="font-weight: 700; font-size: 0.95rem; margin: 0.5rem 0; line-height: 1.4;">${frontText}</div>
            <div class="flashcard-hint">${hint}</div>
          </div>
          <div class="flashcard-back">
            <div style="font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">💡 Visual Solution</div>
            <div style="font-weight: 600; font-size: 0.88rem; margin: 0.5rem 0; line-height: 1.4;">${backText}</div>
            <div class="flashcard-hint">🌟 +20 XP Earned!</div>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `<img src="images/appu_portrait.jpg" alt="APPU" class="chat-msg-avatar"><div class="chat-bubble-content" style="background: transparent; padding: 0; width: 100%;">${html}</div>`;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();

    this.speakText(`Click the card to flip and reveal the visual concept! ${frontText.replace(/⚡/g, '')}`);
  }

  renderRayDiagramVisualizer() {
    const cardId = 'ray_' + Date.now();
    const html = `
      <div class="ray-diagram-card" id="${cardId}">
        <div style="font-weight:800; color:#f59e0b; font-size:0.85rem; margin-bottom:0.4rem;">🔬 Interactive Ray Diagram Simulator</div>
        <div style="font-size:0.8rem; color:#94a3b8; margin-bottom:0.5rem;">Drag object distance (u) to see live image behavior!</div>
        <canvas id="${cardId}_canvas" width="300" height="120" style="width:100%; height:120px; background:#020617; border-radius:8px;"></canvas>
        <div class="ray-diagram-controls">
          <span>u = <strong id="${cardId}_uVal" style="color:#f59e0b;">30</strong> cm</span>
          <input type="range" class="ray-slider" min="15" max="60" value="30" oninput="window.appuEngine.updateRayDiagram('${cardId}', this.value)">
          <span id="${cardId}_status" style="color:#10b981; font-weight:700;">Real & Inverted</span>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `<img src="images/appu_portrait.jpg" alt="APPU" class="chat-msg-avatar"><div class="chat-bubble-content" style="background: transparent; padding: 0; width: 100%;">${html}</div>`;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();

    setTimeout(() => this.updateRayDiagram(cardId, 30), 100);
    this.speakText(`Here is an interactive optics ray diagram! Drag the slider to see how object distance affects image formation.`);
  }

  updateRayDiagram(cardId, u) {
    const canvas = document.getElementById(`${cardId}_canvas`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const uVal = document.getElementById(`${cardId}_uVal`);
    const statusVal = document.getElementById(`${cardId}_status`);

    if (uVal) uVal.textContent = u;

    const f = 20;
    const uNum = parseFloat(u);

    if (statusVal) {
      if (uNum > f) {
        statusVal.textContent = "Real & Inverted";
        statusVal.style.color = "#10b981";
      } else {
        statusVal.textContent = "Virtual & Erect";
        statusVal.style.color = "#ec4899";
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;
    const poleX = canvas.width - 40;

    // Principal Axis
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, midY);
    ctx.lineTo(canvas.width - 10, midY);
    ctx.stroke();

    // Mirror Arc
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(poleX + 80, midY, 100, Math.PI * 0.85, Math.PI * 1.15);
    ctx.stroke();

    // Object Line
    const objX = Math.max(20, poleX - uNum * 3.5);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, midY);
    ctx.lineTo(objX, midY - 35);
    ctx.stroke();

    // Focal Point F
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(poleX - f * 3.5, midY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Light Rays
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(objX, midY - 35);
    ctx.lineTo(poleX, midY - 35);
    ctx.lineTo(poleX - f * 7, midY);
    ctx.stroke();
  }

  triggerWeakSpotRadar(topic = "Convex Mirror Ray Diagrams & Focal Length") {
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();

      const responseMsg = `📡 **APPU DIAGNOSTIC WEAK-SPOT RADAR ACTIVATED!**\n` +
        `Detected Concept Gap: **${topic}** (Current Accuracy: 67% ➔ Target: 90%+)\n\n` +
        `🧠 **1-MINUTE VISUAL SHORTCUT FORMULA**:\n` +
        `• Convex Mirrors ALWAYS form *Virtual, Erect, and Diminished* images, regardless of object distance!\n` +
        `• Mirror Formula Shortcut: \`1/f = 1/v + 1/u\` (For convex, focal length \`f\` is ALWAYS positive \`+f\`)\n\n` +
        `💡 **REAL-WORLD ANALOGY**:\n` +
        `Think of a convex mirror like a **wide-angle GoPro camera**—it squeezes a huge background highway into a tiny mirror so drivers see all traffic blindspots!\n\n` +
        `🎯 **MICRO-PRACTICE QUEST (Gap Elimination)**:\n` +
        `1. An object is placed 20 cm in front of a convex mirror of radius 30 cm. What is the image distance \`v\`?\n` +
        `2. Does a convex mirror ever produce a real inverted image? (Yes / No)\n\n` +
        `✨ *This Micro-Remediation Card has been dispatched to your WhatsApp!*`;

      this.addAPPUMessage(responseMsg);

      // Render WhatsApp Dispatch Card for Weak-Spot Radar
      const radarCardHtml = `
        <div class="whatsapp-dispatch-card" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.35);">
          <div class="whatsapp-dispatch-header" style="color: #9333ea;">
            <span>📡 1-Min Weak-Spot Micro-Remediation Dispatched!</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-sub);">
            <strong>Targeted Weak Spot:</strong> ${topic}<br>
            <strong>Trajectory Impact:</strong> 67% ➔ 90%+ (+23% Jump)<br>
            <strong>WhatsApp Delivery:</strong> Dispatched to +91 ${this.session.phone}
          </div>
          <a href="https://wa.me/91${this.session.phone}?text=Hi%20APPU!%20I%20received%20my%201-Minute%20Weak-Spot%20Micro-Remediation%20Card." target="_blank" class="btn btn-whatsapp" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-top: 0.4rem;">
            📲 View Micro-Remediation on WhatsApp
          </a>
        </div>
      `;

      const div = document.createElement('div');
      div.className = 'chat-bubble-row appu';
      div.innerHTML = `<div class="chat-bubble-content">${radarCardHtml}</div>`;
      this.elements.chatBody.appendChild(div);
      this.scrollToBottom();
    }, 600);
  }

  triggerParentWeeklyDigest() {
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();

      const studentName = this.session.name || "Ananya Sharma";
      const digestMsg = `📊 **APPU SUNDAY WEEKLY PROGRESS DIGEST** for **${studentName}**:\n\n` +
        `📈 **Trajectory Score**: 67% ➔ **88%** (+21% Academic Jump in 2 Weeks!)\n` +
        `🧠 **Concept Gaps Eliminated**: 14 Weak Spots Fixed in Math & Physics\n` +
        `⏱️ **Unproductive Screen Time Saved**: 60% Reduction (4.5 Hours Saved)\n` +
        `✨ **APPU Recommendation**: 15 mins on Physics Light formulas next week!\n\n` +
        `📲 *This Weekly Parent Digest has been automatically dispatched to your registered WhatsApp number!*`;

      this.addAPPUMessage(digestMsg);

      // Render Parent Digest WhatsApp Status Card
      const digestCardHtml = `
        <div class="whatsapp-dispatch-card" style="background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.35);">
          <div class="whatsapp-dispatch-header" style="color: #16a34a;">
            <span>📊 Sunday Parent Digest Dispatched to WhatsApp!</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-sub);">
            <strong>Student:</strong> ${studentName}<br>
            <strong>Current Trajectory:</strong> 67% ➔ 88% (+21% Jump)<br>
            <strong>Recipient:</strong> Parent WhatsApp (+91 ${this.session.phone})
          </div>
          <a href="https://wa.me/91${this.session.phone}?text=Hi%20APPU!%20I%20received%20the%20Sunday%20Weekly%20Progress%20Digest." target="_blank" class="btn btn-whatsapp" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-top: 0.4rem;">
            💬 View Weekly Digest on WhatsApp
          </a>
        </div>
      `;

      const div = document.createElement('div');
      div.className = 'chat-bubble-row appu';
      div.innerHTML = `<div class="chat-bubble-content">${digestCardHtml}</div>`;
      this.elements.chatBody.appendChild(div);
      this.scrollToBottom();
    }, 600);
  }

  async handleStudyScheduleIntent(userQuery) {
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();

      const detailsAgenda = `🎯 STUDY GOAL & AGENDA:\n` +
        `• 40-Hour CBSE High School Foundation & Mastery Plan\n` +
        `• Pacing: 2 Hours Daily for 20 Days (Morning 9 AM & Evening 5 PM)\n` +
        `• Night Break: Enforced OFF after 8:30 PM\n` +
        `• Syllabus Breakdown: Math (16 hrs), Science (14 hrs), SST (6 hrs), AI Skills (4 hrs)\n` +
        `✨ Mentor Notes: Powered by IGr APPU AI. Stay focused!`;

      // 20-Day Recurring Google Calendar Template URL
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent('CBSE 40-Hour Study Session: APPU')}` +
        `&details=${encodeURIComponent(detailsAgenda)}` +
        `&location=${encodeURIComponent('APPU Learning Platform')}` +
        `&recur=${encodeURIComponent('RRULE:FREQ=DAILY;COUNT=20')}`;

      const responseMsg = `Awesome goal, **${this.session.name}**! 📅✨ APPU has generated your **40-Hour CBSE Mastery Schedule** starting tomorrow!\n\n` +
        `🗓️ **Schedule Plan**: 2 Hours Daily for 20 Consecutive Days (40 Hours Total)\n` +
        `🌅 **Morning Session**: 9:00 AM – 10:00 AM (1 Hour)\n` +
        `🌆 **Evening Session**: 5:00 PM – 6:00 PM (1 Hour)\n` +
        `🌙 **Night Rest**: OFF after 8:30 PM (Enforced night break!)\n\n` +
        `Click the button below to **add all 20 daily study reminders at once to your Google Calendar**!`;

      this.addAPPUMessage(responseMsg);

      // Render Schedule Confirmation Card inside chat
      const scheduleCardHtml = `
        <div class="whatsapp-dispatch-card" style="background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.35);">
          <div class="whatsapp-dispatch-header" style="color: #d97706;">
            <span>📅 20-Day Recurring Calendar Reminders Ready!</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-sub);">
            <strong>Student:</strong> ${this.session.name}<br>
            <strong>Duration:</strong> 20 Days (40 Hours Total)<br>
            <strong>Times:</strong> 9:00 AM & 5:00 PM Daily<br>
            <strong>Night Break:</strong> 8:30 PM - 8:00 AM (OFF)
          </div>
          <a href="${gCalUrl}" target="_blank" class="btn btn-gold" style="padding: 0.5rem 0.9rem; font-size: 0.82rem; margin-top: 0.4rem; display: inline-flex; align-items: center; gap: 0.4rem;">
            📅 Add All 20 Daily Reminders to Google Calendar
          </a>
        </div>
      `;

      const div = document.createElement('div');
      div.className = 'chat-bubble-row appu';
      div.innerHTML = `<div class="chat-bubble-content">${scheduleCardHtml}</div>`;
      this.elements.chatBody.appendChild(div);
      this.scrollToBottom();
    }, 600);
  }

  async handleWhatsAppSyllabusIntent(userQuery) {
    this.showTypingIndicator();

    // Parse grade and subject
    let grade = "Class 10th";
    if (userQuery.match(/class\s*([0-9]{1,2})/i)) {
      grade = "Class " + userQuery.match(/class\s*([0-9]{1,2})/i)[1] + "th";
    }

    let subject = "Science & Mathematics";
    if (userQuery.toLowerCase().includes('science')) subject = "Science";
    else if (userQuery.toLowerCase().includes('math')) subject = "Mathematics";
    else if (userQuery.toLowerCase().includes('social')) subject = "Social Science";

    const requestedSyllabus = `${grade} ${subject} Complete CBSE 2026-27 Syllabus Guide`;

    const payload = {
      user_name: this.session.name,
      user_phone: this.session.phone,
      user_role: this.session.role,
      requested_syllabus: requestedSyllabus,
      grade: grade,
      timestamp: new Date().toISOString()
    };

    const n8nRes = await window.n8nClient.triggerWhatsAppSyllabus(payload);

    this.removeTypingIndicator();

    const responseMsg = `Great choice, ${this.session.name}! 📚 I have parsed your request for the **${requestedSyllabus}**. My n8n automated delivery system has dispatched the file directly to your WhatsApp number (**${this.session.phone}**)!`;

    this.addAPPUMessage(responseMsg);

    // Render WhatsApp Dispatch Status Card
    const dispatchCardHtml = `
      <div class="whatsapp-dispatch-card">
        <div class="whatsapp-dispatch-header">
          <span>📲 WhatsApp Automated Dispatch Successful!</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-sub);">
          <strong>Document:</strong> ${requestedSyllabus}<br>
          <strong>Sent to:</strong> +91 ${this.session.phone}<br>
          <strong>n8n Execution ID:</strong> <code>${n8nRes.executionId || 'exec_active_01'}</code>
        </div>
        <a href="https://wa.me/91${this.session.phone}?text=Hi%20APPU!%20I%20received%20my%20${encodeURIComponent(requestedSyllabus)}" target="_blank" class="btn btn-whatsapp" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-top: 0.4rem;">
          💬 Open WhatsApp Chat
        </a>
      </div>
    `;

    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `<div class="chat-bubble-content">${dispatchCardHtml}</div>`;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  handleEfficacyQuery() {
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      let text = "";
      if (this.session.role === 'Parent') {
        text = `As a parent, your main priority is learning quality over screen quantity. **IGr reduces unproductive screen time by up to 60%** because APPU uses micro-targeted 15-minute diagnostic quests instead of endless video scrolling. Within 40 focused hours, students achieve strong conceptual clarity, leading to an **academic boost of 30-50%**! 📈 You can track real-time mastery on your Parent Dashboard.`;
      } else {
        text = `Hey ${this.session.name}! 🚀 With APPU, you don't need to sit for hours staring at boring screens! In just **40 total hours**, APPU breaks complex topics into bite-sized gamified quests. You learn faster, retain 2x more, and still have plenty of time for sports and hobbies! 🏆`;
      }
      this.addAPPUMessage(text);
    }, 600);
  }

  async handleAdaptiveAIResponse(query) {
    this.showTypingIndicator();
    
    // Construct rich profile context string for n8n AI Agent
    const fullQuery = `[Student Profile: Name=${this.session.name}, Role=${this.session.role}, Phone=${this.session.phone}, Grade=${this.session.grade}] User Query: ${query}`;
    const sessionId = 'session_' + (this.session.phone || 'guest_' + Date.now());

    const liveResponse = await window.n8nClient.sendChatToAgent(fullQuery, sessionId);
    this.removeTypingIndicator();

    if (liveResponse && typeof liveResponse === 'string' && liveResponse.trim().length > 0) {
      this.addAPPUMessage(liveResponse);
      return;
    }

    // Fallback persona response if offline
    let text = "";
    if (this.session.role === 'Student') {
      text = `That's a fantastic question, ${this.session.name}! 🌟 Every step you take to understand this topic makes you smarter and more confident. Let's break it down together in a fun, step-by-step way!\n\n1️⃣ **Core Concept**: Think of this like building a super-strong foundation for a tall skyscraper.\n2️⃣ **Real-World Connection**: You see this happening every day around you!\n3️⃣ **Quick Win**: Practice just 3 targeted questions with APPU and you'll master this in no time!\n\nRemember: Small steps lead to giant leaps! Keep shining! Appu is always here for you! ✨`;
    } else {
      text = `Thank you for asking, ${this.session.name}. 📊 In our Parent Framework for CBSE high school preparation:\n\n1. **Diagnostic Assessment**: APPU pinpoints exact concept gaps in real-time.\n2. **Targeted Mastery**: Study time focuses 100% on weak areas.\n3. **Full Transparency**: Real-time progress updates on your dashboard.\n\nWould you like to book a 1-on-1 Discovery Call or receive our detailed CBSE curriculum roadmap on WhatsApp?`;
    }
    this.addAPPUMessage(text);
  }

  addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-bubble-row user';
    div.innerHTML = `<div class="chat-bubble-content">${this.escapeHTML(text)}</div>`;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  addAPPUMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `
      <img src="images/appu_portrait.jpg" alt="APPU" class="chat-msg-avatar">
      <div class="chat-bubble-content">
        ${this.formatMarkdown(text)}
        <br>
        <button class="chat-listen-btn" onclick="window.appuEngine.speakText(this.parentElement.innerText.replace('🔊 Listen to APPU', ''))">
          🔊 Listen to APPU
        </button>
      </div>
    `;
    this.elements.chatBody.appendChild(div);
    this.speakText(text);

    const lower = text.toLowerCase();

    // Auto-detect WhatsApp syllabus request and attach interactive WhatsApp Card
    if ((lower.includes('whatsapp') || lower.includes('syllabus') || lower.includes('dispatched')) && this.session.phone) {
      const cleanMsg = text.replace(/[*_#`]/g, ''); // Strip markdown symbols for crisp WhatsApp formatting
      const cardHtml = `
        <div class="whatsapp-dispatch-card" style="margin-top: 0.5rem;">
          <div class="whatsapp-dispatch-header">
            <span>📲 Full CBSE Syllabus & Study Notes Ready</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-sub);">
            <strong>Recipient:</strong> +91 ${this.session.phone}<br>
            <strong>Status:</strong> Full syllabus guide formatted for WhatsApp
          </div>
          <a href="https://wa.me/91${this.session.phone}?text=${encodeURIComponent('📚 IGr APPU - CBSE Study Guide & Syllabus:\n\n' + cleanMsg)}" target="_blank" class="btn btn-whatsapp" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; margin-top: 0.4rem; display: inline-flex; align-items: center; gap: 0.4rem;">
            💬 Receive Full Syllabus in WhatsApp
          </a>
        </div>
      `;
      const cardDiv = document.createElement('div');
      cardDiv.className = 'chat-bubble-row appu';
      cardDiv.innerHTML = `<div class="chat-bubble-content" style="background: transparent; padding: 0;">${cardHtml}</div>`;
      this.elements.chatBody.appendChild(cardDiv);
    }

    // Auto-detect Calendar Reminder request and attach interactive Google Calendar Card
    if (lower.includes('reminder') || lower.includes('calendar') || lower.includes('scheduled')) {
      // Filter out conversational chat filler lines
      const cleanLines = text.split('\n')
        .map(line => line.replace(/[*_#`]/g, '').trim())
        .filter(line => line.length > 0 && 
          !line.toLowerCase().includes('successfully scheduled') &&
          !line.toLowerCase().includes('further assistance') &&
          !line.toLowerCase().includes('happy studying') &&
          !line.toLowerCase().includes('feel free to ask')
        );

      const cleanAgenda = cleanLines.length > 0 ? cleanLines.join('\n• ') : 'Study session for target CBSE topic';
      const eventTitle = `📚 CBSE Study Session: APPU`;
      const eventDetails = `🎯 STUDY GOAL & AGENDA:\n• ${cleanAgenda}\n\n📌 ACTION PLAN:\n• Review key concepts & core formulas\n• Solve 3 targeted APPU Quest practice problems\n\n✨ APPU Notes: Stay focused! Small steps lead to giant leaps. Powered by IGr APPU.`;

      const cardHtml = `
        <div class="whatsapp-dispatch-card" style="margin-top: 0.5rem; background: rgba(14, 165, 233, 0.15); border-color: rgba(14, 165, 233, 0.3);">
          <div class="whatsapp-dispatch-header" style="color: var(--secondary);">
            <span>📅 Structured Study Agenda Ready</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-sub);">
            <strong>Event:</strong> ${eventTitle}<br>
            <strong>Status:</strong> Bulleted action plan ready for Google Calendar
          </div>
          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}" target="_blank" class="btn btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; margin-top: 0.4rem; display: inline-flex; align-items: center; gap: 0.4rem; background: var(--secondary); color: #fff;">
            📅 Save Bulleted Agenda to Google Calendar
          </a>
        </div>
      `;
      const cardDiv = document.createElement('div');
      cardDiv.className = 'chat-bubble-row appu';
      cardDiv.innerHTML = `<div class="chat-bubble-content" style="background: transparent; padding: 0;">${cardHtml}</div>`;
      this.elements.chatBody.appendChild(cardDiv);
    }

    this.scrollToBottom();
  }

  showTypingIndicator() {
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'chat-bubble-row appu';
    div.innerHTML = `
      <div class="chat-bubble-content" style="color: var(--text-muted); font-style: italic;">
        <span>Appu is thinking with warmth... 💡</span>
      </div>
    `;
    this.elements.chatBody.appendChild(div);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    this.elements.chatBody.scrollTop = this.elements.chatBody.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  formatMarkdown(str) {
    if (!str) return '';

    let text = str;

    // 1. Parse Markdown Tables (| col1 | col2 | ...)
    const tableRegex = /((?:\|[^\n]+\|\r?\n)+)/g;
    text = text.replace(tableRegex, (match) => {
      const rows = match.trim().split('\n').map(row => row.trim());
      if (rows.length < 2) return match;
      
      let html = '<div class="chat-table-wrapper"><table class="chat-markdown-table">';
      let inTbody = false;

      rows.forEach((row, index) => {
        // Skip separator row (|---|---|)
        if (row.match(/^\|[\s-:]+\|/)) return;

        const cells = row.split('|').filter((cell, i, arr) => i > 0 && i < arr.length - 1).map(c => this.escapeHTML(c.trim()));
        
        if (index === 0) {
          html += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
          inTbody = true;
        } else {
          html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      
      if (inTbody) html += '</tbody>';
      html += '</table></div>';
      return html;
    });

    // 2. Protect table HTML from text escaping
    const tablePlaceholders = [];
    text = text.replace(/<div class="chat-table-wrapper">[\s\S]*?<\/div>/g, (tableHtml) => {
      tablePlaceholders.push(tableHtml);
      return `___TABLE_PH_${tablePlaceholders.length - 1}___`;
    });

    // 3. Escape standard text safely
    text = this.escapeHTML(text);

    // 4. Restore tables
    tablePlaceholders.forEach((tableHtml, i) => {
      text = text.replace(`___TABLE_PH_${i}___`, tableHtml);
    });

    // 5. Headers (###, ##, #)
    text = text.replace(/^#### (.*?)$/gm, '<h6 class="chat-h6">$1</h6>');
    text = text.replace(/^### (.*?)$/gm, '<h5 class="chat-h5">$1</h5>');
    text = text.replace(/^## (.*?)$/gm, '<h4 class="chat-h4">$1</h4>');
    text = text.replace(/^# (.*?)$/gm, '<h3 class="chat-h3">$1</h3>');

    // 6. Horizontal Rule (--- or ***)
    text = text.replace(/^---$/gm, '<hr class="chat-hr">');
    text = text.replace(/^\*\*\*$/gm, '<hr class="chat-hr">');

    // 7. Bold & Italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 8. Bullet lists
    text = text.replace(/^[\s]*[•\-\*] (.*?)$/gm, '<li class="chat-li">$1</li>');
    text = text.replace(/((?:<li class="chat-li">.*?<\/li>\s*)+)/g, '<ul class="chat-ul">$1</ul>');

    // 9. Line breaks (preserve structure)
    text = text.replace(/\n/g, '<br>');

    // Clean up excessive <br> tags around block elements
    text = text.replace(/<br><div/g, '<div');
    text = text.replace(/<\/div><br>/g, '</div>');
    text = text.replace(/<br><h([3-6])/g, '<h$1');
    text = text.replace(/<\/h([3-6])><br>/g, '</h$1>');
    text = text.replace(/<br><ul/g, '<ul');
    text = text.replace(/<\/ul><br>/g, '</ul>');
    text = text.replace(/<br><hr/g, '<hr');

    return text;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appuEngine = new APPUChatEngine();
});
