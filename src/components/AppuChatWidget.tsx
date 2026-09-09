import React, { useEffect, useRef, useState } from 'react';
import { appuClient } from '../lib/appuClient';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'appu' | 'user';
  text: string;
  timestamp: string;
  audioSource?: string | null;
}

interface AppuChatWidgetProps {
  onOpenEarlyAccess: () => void;
}

export const AppuChatWidget: React.FC<AppuChatWidgetProps> = ({ onOpenEarlyAccess }) => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [role, setRole] = useState<'Student' | 'Parent'>('Student');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'appu',
      text: t('chat.welcome'),
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
      appuClient.stopAllAudio();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    isDraggingRef.current = false;
    const initialX = dragPos ? dragPos.x : (window.innerWidth - 96);
    const initialY = dragPos ? dragPos.y : (window.innerHeight - 104);

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

  /**
   * Play server-provided audio (English or ElevenLabs v3 Kannada inline Base64).
   * Strictly NO browser / system TTS fallback.
   */
  const playAudio = async (audioSource?: string | null, forcePlay: boolean = false) => {
    if (!audioSource) return;
    if (voiceMuted && !forcePlay) return;

    await appuClient.playAudio({
      audioSource,
      onError: (err) => {
        console.warn('[APPU Widget] Server audio playback error (graceful):', err);
      }
    });
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
        text: t('chat.waRedirect'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, appuMsg]);

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
        text: t('chat.callRedirect'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, appuMsg]);

      setTimeout(() => onOpenEarlyAccess(), 500);
      return;
    }

    // Send message to dedicated IGR APPU backend endpoint
    const fullQuery = `[Mode: ${role}] ${text}`;
    const response = await appuClient.sendMessage(fullQuery, lang);
    setIsTyping(false);

    const replyText = (response.output && response.output.trim().length > 0)
      ? response.output.trim()
      : t('chat.errorFallback');

    const appuReply: Message = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'appu',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      audioSource: response.audioSource
    };

    setMessages((prev) => [...prev, appuReply]);

    // Play server-provided inline audio (no browser TTS)
    if (!voiceMuted && response.audioSource) {
      playAudio(response.audioSource);
    }

    setXp((prev) => prev + 20);
  };

  const containerStyle: React.CSSProperties = dragPos
    ? { left: `${dragPos.x}px`, top: `${dragPos.y}px`, bottom: 'auto', right: 'auto' }
    : { bottom: '44px', right: '36px' };

  const roleLabel = role === 'Student' ? t('chat.student') : t('chat.parent');
  const suggestedChips = [t('chat.chip1'), t('chat.chip2'), t('chat.chip3'), t('chat.chip4')];

  return (
    <div className="appu-widget-container" style={containerStyle}>
      {/* Callout Header Pill Above Floating Bubble (Constant, No Dismiss) */}
      {!isOpen && (
        <div
          className="appu-callout-pill"
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(true)}
          title={t('chat.toggleLabel')}
        >
          <div className="callout-pill-body">
            <div className="callout-status-row">
              <span className="callout-live-dot" />
              <span className="callout-status-text">{t('chat.calloutTitle')}</span>
            </div>
            <div className="callout-prompt-text">{t('chat.calloutPrompt')}</div>
          </div>
          <span className="callout-pointer-arrow" aria-hidden="true" />
        </div>
      )}

      {/* Draggable Floating Trigger Bubble */}
      <button
        type="button"
        className="appu-float-bubble"
        onPointerDown={handlePointerDown}
        onClick={handleToggleClick}
        title={t('chat.dragTitle')}
        aria-label={t('chat.toggleLabel')}
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
                <span className="avatar-live-dot" title={t('chat.online')} />
              </div>
              <div className="chat-header-titles">
                <div className="chat-header-title">{t('chat.headerTitle')}</div>
                <div className="chat-header-status-line">
                  <span className="chat-header-subtitle">{t('chat.headerSubtitle')}</span>
                  <span className="status-separator">·</span>
                  <span className="status-online-text">{t('chat.online')}</span>
                  <button
                    type="button"
                    className="role-tag-indicator"
                    onClick={toggleRole}
                    title={`Click to switch between ${t('chat.student')} and ${t('chat.parent')} mode`}
                  >
                    {roleLabel} {t('chat.modeSwitch')}
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-actions-top">
              <button
                type="button"
                className="voice-toggle-btn"
                onClick={() => {
                  if (!voiceMuted) appuClient.stopAllAudio();
                  setVoiceMuted(!voiceMuted);
                }}
                title={voiceMuted ? t('chat.muteTitle') : t('chat.unmuteTitle')}
              >
                {voiceMuted ? t('chat.mute') : t('chat.audio')}
              </button>
              <button
                type="button"
                className="close-chat-btn"
                onClick={() => setIsOpen(false)}
                aria-label={t('chat.closeLabel')}
              >
                &times;
              </button>
            </div>
          </div>

          {/* Minimalist Streak & XP Bar */}
          <div className="chat-xp-bar">
            <span>{t('chat.streak')}: {streak} {t('chat.days')}</span>
            <div className="xp-progress-wrapper">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min(100, (xp % 500) / 5)}%` }}
              />
            </div>
            <span>{xp} {t('chat.xp')}</span>
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
                  {msg.sender === 'appu' && msg.audioSource && (
                    <button
                      type="button"
                      className="chat-listen-btn"
                      onClick={() => playAudio(msg.audioSource, true)}
                      title={t('chat.listenTitle')}
                    >
                      {t('chat.listen')}
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
                  <span>{t('chat.thinking')}</span>
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
                <span className="suggested-chips-title">{t('chat.suggestedTitle')}</span>
                <button
                  type="button"
                  className="hide-chips-btn"
                  onClick={() => setShowSuggestions(false)}
                  title={t('chat.hideChips')}
                >
                  {t('chat.hideChips')}
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
                title={t('chat.showChips')}
              >
                {t('chat.showChips')}
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
              placeholder={t('chat.placeholder')}
            />
            <button
              type="button"
              className="send-btn"
              onClick={() => handleSend()}
              aria-label={t('chat.sendLabel')}
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
