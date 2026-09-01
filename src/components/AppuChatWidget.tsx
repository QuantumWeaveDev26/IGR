import React, { useEffect, useRef, useState } from 'react';
import { appuApiClient } from '../lib/n8nClient';
import { useTranslation } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'appu' | 'user';
  text: string;
  timestamp: string;
  audioSource?: string | null;
  audioStreamUrl?: string | null;
  isError?: boolean;
}

interface AppuChatWidgetProps {
  onOpenEarlyAccess: () => void;
}

export const AppuChatWidget: React.FC<AppuChatWidgetProps> = ({ onOpenEarlyAccess }) => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [role, setRole] = useState<'Student' | 'Parent'>('Student');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [xp, setXp] = useState(350);
  const [streak] = useState(3);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Drag State for Floating Assistant
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const DEFAULT_AVATAR = '/images/appu_portrait.jpg';

  // Initialize or update initial greeting when language or role changes (if no conversation yet)
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        const greetingText = role === 'Student'
          ? t.appuChat.initialGreetingStudent
          : t.appuChat.initialGreetingParent;
        return [
          {
            id: 'msg-init',
            sender: 'appu',
            text: greetingText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }
      return prev;
    });
  }, [language, role, t]);

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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = () => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      } catch {}
    }
    setIsPlayingAudio(false);
  };

  /**
   * Play server-side ElevenLabs audio using native HTMLAudioElement.
   * Strict Invariant: BROWSER_TTS_USED = NO. If playback fails, do not fall back to browser TTS.
   */
  const playElevenLabsAudio = async (sourceUrlOrBase64?: string | null) => {
    if (voiceMuted || !sourceUrlOrBase64) return;
    stopAllAudio();

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 1.0;
      audio.muted = false;

      // Handle Base64 or standard HTTP stream URL
      if (sourceUrlOrBase64.startsWith('data:') || sourceUrlOrBase64.startsWith('http')) {
        audio.src = sourceUrlOrBase64;
      } else {
        audio.src = `data:audio/mpeg;base64,${sourceUrlOrBase64}`;
      }

      audio.onplay = () => setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
        audioPlayerRef.current = null;
      };
      audio.onerror = (e) => {
        console.warn('[APPU Voice] Audio element error:', e);
        setIsPlayingAudio(false);
        audioPlayerRef.current = null;
      };

      audioPlayerRef.current = audio;
      await audio.play();
    } catch (err) {
      console.warn('[APPU Voice] Audio playback failed or blocked by autoplay policy:', err);
      setIsPlayingAudio(false);
      audioPlayerRef.current = null;
    }
  };

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  const toggleRole = () => {
    const nextRole = role === 'Student' ? 'Parent' : 'Student';
    setRole(nextRole);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    stopAllAudio();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInputValue('');
    setIsTyping(true);
    scrollToBottom();

    // Check for special action triggers (WhatsApp / Discovery call)
    const lower = textToSend.toLowerCase();
    if (lower.includes('whatsapp') || lower.includes('വാട്ട്സ്ആപ്പ്') || lower.includes('ವಾಟ್ಸಾಪ್')) {
      setTimeout(() => {
        setIsTyping(false);
        const waMsg: Message = {
          id: `appu-${Date.now()}`,
          sender: 'appu',
          text: t.appuChat.whatsappRedirectMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, waMsg]);
        window.open('https://wa.me/919740595677?text=Hi%20IGr%20APPU%20Mentor%2C%20I%20have%20a%20question%20about%20CBSE%20learning.', '_blank');
      }, 700);
      return;
    }

    if (lower.includes('call') || lower.includes('discovery') || lower.includes('counselor') || lower.includes('ಕರೆ')) {
      setTimeout(() => {
        setIsTyping(false);
        const callMsg: Message = {
          id: `appu-${Date.now()}`,
          sender: 'appu',
          text: t.appuChat.callRedirectMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, callMsg]);
        onOpenEarlyAccess();
      }, 700);
      return;
    }

    // Call live secure APPU backend API
    try {
      const response = await appuApiClient.sendChatMessage({
        message: textToSend,
        language: language,
        includeAudio: !voiceMuted
      });

      setIsTyping(false);

      if (response.text) {
        const appuMsg: Message = {
          id: response.requestId || `appu-${Date.now()}`,
          sender: 'appu',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audioSource: response.audioSource,
          audioStreamUrl: response.audioStreamUrl
        };
        setMessages((prev) => [...prev, appuMsg]);
        setXp((prev) => prev + 25);

        // Auto-play server-side ElevenLabs audio if available and not muted
        if (!voiceMuted) {
          const audioTarget = response.audioStreamUrl || response.audioSource;
          if (audioTarget) {
            playElevenLabsAudio(audioTarget);
          }
        }
      } else if (response.error === 'guest_limit_reached') {
        const limitMsg: Message = {
          id: `appu-limit-${Date.now()}`,
          sender: 'appu',
          text: t.appuChat.errorRateLimit,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        setMessages((prev) => [...prev, limitMsg]);
      } else {
        const errorMsg: Message = {
          id: `appu-err-${Date.now()}`,
          sender: 'appu',
          text: response.errorMessage || t.appuChat.errorNetwork,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.warn('[APPU Chat Widget Error]', err);
      setIsTyping(false);
      const errorMsg: Message = {
        id: `appu-err-${Date.now()}`,
        sender: 'appu',
        text: t.appuChat.errorNetwork,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="appu-chat-container">
      {/* Floating Mascot Button */}
      <button
        type="button"
        className={`appu-floating-button ${isOpen ? 'active' : ''} ${isPlayingAudio ? 'speaking' : ''}`}
        style={
          dragPos
            ? { left: `${dragPos.x}px`, top: `${dragPos.y}px`, bottom: 'auto', right: 'auto', position: 'fixed' }
            : undefined
        }
        onPointerDown={handlePointerDown}
        onClick={handleToggleClick}
        aria-label={t.appuChat.ariaToggle}
        title={t.appuChat.dragTooltip}
      >
        <div className="appu-button-inner">
          <img
            src={DEFAULT_AVATAR}
            alt="APPU Avatar"
            className="appu-avatar-img"
            onError={handleImageError}
          />
          <div className="floating-appu-mascot" aria-hidden="true">
            <div className="floating-appu-head">
              <span className="floating-eye left" />
              <span className="floating-eye right" />
              <span className="floating-smile" />
            </div>
          </div>
          <span className="floating-pulse" />
        </div>
        {unreadCount > 0 && !isOpen && (
          <span className="appu-badge">{unreadCount}</span>
        )}
      </button>

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div
          className="appu-chat-drawer animate-slide-up"
          style={
            dragPos
              ? {
                  left: `${Math.min(window.innerWidth - 380, Math.max(16, dragPos.x - 300))}px`,
                  top: `${Math.max(16, Math.min(window.innerHeight - 560, dragPos.y - 480))}px`,
                  bottom: 'auto',
                  right: 'auto',
                  position: 'fixed'
                }
              : undefined
          }
        >
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="mini-appu-badge">
                <img
                  src={DEFAULT_AVATAR}
                  alt="APPU"
                  className="mini-appu-avatar"
                  onError={handleImageError}
                />
                <span className="avatar-live-dot" title="online" />
              </div>
              <div className="chat-header-titles">
                <div className="chat-header-title">{t.appuChat.headerTitle}</div>
                <div className="chat-header-status-line">
                  <span className="status-online-text">online</span>
                  <button
                    type="button"
                    className="role-tag-indicator"
                    onClick={toggleRole}
                    title={role === 'Student' ? t.appuChat.switchModeStudent : t.appuChat.switchModeParent}
                  >
                    {role === 'Student' ? t.appuChat.studentMode : t.appuChat.parentMode} · ↺
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
                title={voiceMuted ? t.appuChat.unmuteVoice : t.appuChat.muteVoice}
              >
                {voiceMuted ? t.appuChat.voiceMuted : t.appuChat.voiceActive}
              </button>
              <button
                type="button"
                className="close-chat-btn"
                onClick={() => {
                  stopAllAudio();
                  setIsOpen(false);
                }}
                aria-label="Close Chat"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Minimalist Streak & XP Bar */}
          <div className="chat-xp-bar">
            <span>{t.appuChat.streakLabel}: {streak} DAYS</span>
            <div className="xp-progress-wrapper">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
              />
            </div>
            <span>{xp} {t.appuChat.xpLabel}</span>
          </div>

          {/* Chat Body */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row sender-${msg.sender} ${msg.isError ? 'bubble-error' : ''}`}>
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
                  {msg.sender === 'appu' && (msg.audioSource || msg.audioStreamUrl) && (
                    <button
                      type="button"
                      className="chat-listen-btn"
                      onClick={() => playElevenLabsAudio(msg.audioStreamUrl || msg.audioSource)}
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
                  <span>{t.appuChat.thinkingText}</span>
                  <span className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Suggestions */}
          {showSuggestions ? (
            <div className="suggested-chips-container">
              <div className="suggested-chips-header">
                <span className="suggested-chips-title">{t.appuChat.suggestedTitle.toUpperCase()}</span>
                <button
                  type="button"
                  className="hide-chips-btn"
                  onClick={() => setShowSuggestions(false)}
                  title="Hide suggestions"
                >
                  &times;
                </button>
              </div>
              <div className="suggested-chips">
                {t.appuChat.suggestions.map((chip, idx) => (
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
                💡 {t.appuChat.suggestedTitle}
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
              placeholder={t.appuChat.placeholder}
            />
            <button
              type="button"
              className="send-btn"
              onClick={() => handleSend()}
              aria-label={t.appuChat.sendLabel}
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
