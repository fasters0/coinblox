'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronDown, Send } from 'lucide-react';

const SEED_MESSAGES = [
  { user: 'zynthex', badge: 'VIP', color: 'text-gold-500', text: 'crash just hit 12x insane' },
  { user: 'blocklord', badge: null, color: 'text-neutral-300', text: 'mines is way safer honestly' },
  { user: 'nova_rae', badge: 'MOD', color: 'text-win', text: 'gl everyone, remember to play responsibly' },
  { user: 'kaidenX', badge: null, color: 'text-neutral-300', text: 'anyone else grinding leaderboard rn' },
  { user: 'pixelpeach', badge: 'VIP', color: 'text-gold-500', text: 'that was so close to a bust' },
];

export default function LiveChat() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { user: 'you', badge: null, color: 'text-gold-400', text: input.trim() }]);
    setInput('');
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-4 py-3 border-b border-white/5"
      >
        <span className="flex items-center gap-2 font-display font-semibold text-sm">
          <MessageSquare className="w-4 h-4 text-gold-500" /> Live chat
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>

      {open && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-72 px-4 py-3 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className="text-sm leading-snug">
                <span className={`font-semibold ${m.color}`}>{m.user}</span>
                {m.badge && (
                  <span className="ml-1.5 text-[10px] font-bold bg-base-700 px-1.5 py-0.5 rounded text-neutral-300">
                    {m.badge}
                  </span>
                )}
                <span className="text-neutral-400">: {m.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Say something…"
              className="input-bet text-sm py-2"
            />
            <button onClick={handleSend} className="bg-gold-500 hover:bg-gold-400 text-base-950 rounded-lg p-2.5 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
