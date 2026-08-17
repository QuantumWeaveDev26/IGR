import React, { useEffect, useRef, useState } from 'react';
import { n8nClient } from '../lib/n8nClient';

interface Message {
  id: string;
  sender: 'appu' | 'user';
  text: string;
  timestamp: string;
}

interface AppuChatWidgetProps {
  onOpenEarlyAccess: () => void;
}

export const AppuChatWidget: React.FC<AppuChatWidgetProps> = ({ onOpenEarlyAccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [role, setRole] = useState<'Student' | 'Parent'>('Student');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'appu',
      text: "Namaste! 👋 I'm **APPU**, your AI Academic Mentor for CBSE Class 6 to 12. Ask me anything about your syllabus, math formulas, physics concepts, or exam prep! After every answer, I can also send notes straight to your WhatsApp or schedule a Google Calendar revision reminder for you. 🚀",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [xp, setXp] = useState(350);
  const [streak, setStreak] = useState(3);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Drag State for Floating Assistant
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const DEFAULT_AVATAR = '/images/appu_portrait.jpg';

  const suggestedChips = [
    "Class 10 Light & Optics",
    "Class 9 Polynomials",
    "Send notes to WhatsApp 📲",
    "Set revision reminder 📅"
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 50);
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    isDraggingRef.current = false;
    const initialX = dragPos ? dragPos.x : (window.innerWidth - 84);
    const initialY = dragPos ? dragPos.y : (window.innerHeight - 84);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: initialX,
      posY: initialY
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        isDraggingRef.current = true;
      }

      const newX = Math.max(12, Math.min(window.innerWidth - 72, dragStartRef.current.posX + dx));
      const newY = Math.max(12, Math.min(window.innerHeight - 72, dragStartRef.current.posY + dy));

      setDragPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleToggleClick = () => {
    if (!isDraggingRef.current) {
      setIsOpen(!isOpen);
    }
  };

  // Audio player ref to guarantee strictly ONE voice plays at a time
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAllAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  const speakText = async (text: string, forcePlay: boolean = false) => {
    const cleanText = text.replace(/[*_#`~✦✳•]/g, '').trim();
    if (!cleanText) return;

    if (voiceMuted && !forcePlay) return;

    // 1. Immediately stop any currently playing audio or speech synthesis
    stopAllAudio();

    try {
      // 2. Fetch APPU Voice Audio from live Hugging Face API Space
      const audioUrl = await n8nClient.generateAppuVoice(cleanText);
      
      if (audioUrl) {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('APPU Voice API error, falling back to speech synthesis:', err);
    }

    // Fallback: Browser Speech Synthesis ONLY if HF Voice API returns null
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent && !parent.querySelector('.appu-fallback-avatar')) {
      const div = document.createElement('div');
      div.className = 'appu-fallback-avatar';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.borderRadius = '50%';
      div.style.background = 'var(--tomato)';
      div.style.color = '#ffffff';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.font = '700 13px var(--serif)';
      div.innerText = 'I';
      parent.appendChild(div);
    }
  };

  const toggleRole = () => {
    setRole((prev) => (prev === 'Student' ? 'Parent' : 'Student'));
  };

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputValue.trim();
    if (!text) return;

    if (!queryText) {
      setInputValue('');
    }

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    scrollToBottom();

    const textLower = text.toLowerCase();
    if (textLower.includes('whatsapp')) {
      setIsTyping(false);
      const appuMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'appu',
        text: "Connecting you directly to IGr on WhatsApp...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, appuMsg]);
      
      if (!voiceMuted) speakText(appuMsg.text);
      
      setTimeout(() => {
        window.open("https://wa.me/919740595677?text=Hi%20IGr%2C%20I%20would%20like%20to%20know%20more%20about%20APPU%20for%20CBSE%20learning.", "_blank");
      }, 500);
      return;
    }

    if (textLower.includes('book') || textLower.includes('call') || textLower.includes('early access')) {
      setIsTyping(false);
      const appuMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'appu',
        text: "Connecting you with our CBSE Learning Specialist. Opening your discovery call modal now...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, appuMsg]);
      
      if (!voiceMuted) speakText(appuMsg.text);
      
      setTimeout(() => onOpenEarlyAccess(), 500);
      return;
    }

    const sessionId = 'session_react_' + Date.now();
    const fullQuery = `[Mode: ${role}] ${text}`;
    const n8nResponse = await n8nClient.sendChatToAgent(fullQuery, sessionId);
    setIsTyping(false);

    let replyText = "";
    if (n8nResponse && typeof n8nResponse === 'string' && n8nResponse.trim().length > 0) {
      replyText = n8nResponse.trim();
    } else {
      if (role === 'Student') {
        replyText = `Namaste! 🚀 That's a great question!\n\nIGr is designed around how you understand best—whether visually, through stories, or by trying things hands-on.\n\nInstead of a single fixed syllabus, every learner receives a **personalized learning route**.\n\nWould you like to explore your child's personalized route with a **FREE Discovery Call**?`;
      } else {
        replyText = `Namaste! 🌿 Thank you for asking. In our **Parent Framework** for CBSE high school preparation:\n\n• **Concept Mastery**: Diagnostic loops pinpoint exact understanding gaps.\n• **Adaptive Pace**: Study time focuses 100% on areas needing clarity.\n• **Transparent Progress**: Track learning milestones on your dashboard.\n\nWould you like to book a **1-on-1 Discovery Call** for a custom learning plan?`;
      }
    }

    const appuReply: Message = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'appu',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, appuReply]);
    
    if (!voiceMuted) speakText(replyText);
    
    setXp((prev) => prev + 20);
  };

  const containerStyle: React.CSSProperties = dragPos
    ? { left: `${dragPos.x}px`, top: `${dragPos.y}px`, bottom: 'auto', right: 'auto' }
    : { bottom: '24px', right: '24px' };

  return (
    <div className="appu-widget-container" style={containerStyle}>
      {/* Draggable Floating Trigger Bubble */}
      <button
        type="button"
        className="appu-float-bubble"
        onPointerDown={handlePointerDown}
        onClick={handleToggleClick}
        title="Drag me anywhere or click to chat with APPU"
        aria-label="Toggle APPU chat"
      >
        <img
          src={DEFAULT_AVATAR}
          alt="APPU"
          className="appu-bubble-avatar"
          onError={handleImageError}
        />
        {unreadCount > 0 && !isOpen && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </button>

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="appu-chat-window open">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-user-info">
              <div className="mini-appu-avatar-wrapper">
                <img
                  src={DEFAULT_AVATAR}
                  alt="APPU"
                  className="mini-appu-avatar"
                  onError={handleImageError}
                />
                <span className="avatar-live-dot" title="online" />
              </div>
              <div className="chat-header-titles">
                <div className="chat-header-title">APPU</div>
                <div className="chat-header-status-line">
                  <span className="status-online-text">online</span>
                  <button
                    type="button"
                    className="role-tag-indicator"
                    onClick={toggleRole}
                    title="Click to switch between Student and Parent mode"
                  >
                    {role} Mode · Switch ↺
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-actions-top">
              <button
                type="button"
                className="voice-toggle-btn"
                onClick={() => {
                  if (!voiceMuted) stopAllAudio();
                  setVoiceMuted(!voiceMuted);
                }}
                title={voiceMuted ? "Unmute Voice Audio" : "Mute Voice Audio"}
              >
                {voiceMuted ? 'Mute' : 'Audio 🔊'}
              </button>
              <button
                type="button"
                className="close-chat-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Minimalist Streak & XP Bar */}
          <div className="chat-xp-bar">
            <span>STREAK: {streak} DAYS</span>
            <div className="xp-progress-wrapper">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
              />
            </div>
            <span>{xp} XP</span>
          </div>

          {/* Chat Body */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row sender-${msg.sender}`}>
                {msg.sender === 'appu' && (
                  <img
                    src={DEFAULT_AVATAR}
                    alt="APPU"
                    className="chat-msg-avatar"
                    onError={handleImageError}
                  />
                )}
                <div className="chat-bubble-content">
                  <div dangerouslySetInnerHTML={{ __html: formatMessageMarkdown(msg.text) }} />
                  {msg.sender === 'appu' && (
                    <button
                      type="button"
                      className="chat-listen-btn"
                      onClick={() => speakText(msg.text, true)}
                      title="Listen to APPU's voice"
                    >
                      🔊 Listen
                    </button>
                  )}
                  <span className="chat-msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row sender-appu">
                <img
                  src={DEFAULT_AVATAR}
                  alt="APPU"
                  className="chat-msg-avatar"
                  onError={handleImageError}
                />
                <div className="chat-bubble-content typing">
                  <span>APPU is thinking...</span>
                  <span className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Collapsible Suggestions */}
          {showSuggestions ? (
            <div className="suggested-chips-container">
              <div className="suggested-chips-header">
                <span className="suggested-chips-title">SUGGESTED QUESTIONS</span>
                <button
                  type="button"
                  className="hide-chips-btn"
                  onClick={() => setShowSuggestions(false)}
                  title="Hide suggestions for more chat space"
                >
                  &times; Hide
                </button>
              </div>
              <div className="suggested-chips">
                {suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chip-btn"
                    onClick={() => handleSend(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="show-chips-bar">
              <button
                type="button"
                className="reopen-chips-btn"
                onClick={() => setShowSuggestions(true)}
                title="Show suggested questions"
              >
                💡 Show Suggested Questions
              </button>
            </div>
          )}

          {/* Footer Input */}
          <div className="chat-footer">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask APPU anything about CBSE..."
            />
            <button
              type="button"
              className="send-btn"
              onClick={() => handleSend()}
              aria-label="Send message"
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMessageMarkdown(text: string): string {
  const safeText = escapeHtml(text);
  return safeText
    .replace(/^### (.*$)/gim, '<h4 style="font-weight:700; margin-top:6px; margin-bottom:4px;">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-weight:700; margin-top:8px; margin-bottom:4px;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.06); padding:2px 4px; border-radius:4px; font-size:12px;">$1</code>')
    .replace(/^[•\-]\s+(.*$)/gim, '<li style="margin-left:14px; list-style-type:disc;">$1</li>')
    .replace(/\n/g, '<br />');
}

