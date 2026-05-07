import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/utils/formatters';
import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là BookVerse AI. Tôi có thể giúp gì cho bạn trong việc tìm kiếm những cuốn sách tuyệt vời?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(ENDPOINTS.AI.CHAT, { message: input });
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.reply
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Lỗi khi gọi AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Xin lỗi, hiện tại tôi không thể kết nối tới máy chủ AI. Vui lòng thử lại sau.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Nút bấm nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
          isOpen ? "bg-on-surface text-surface rotate-90" : "bg-primary text-on-primary"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary rounded-full animate-ping"></span>
        )}
      </button>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-surface border border-outline-variant/20 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          {/* Header */}
          <div className="p-6 bg-surface-container-low border-b border-outline-variant/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black text-on-surface">BookVerse AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-success uppercase tracking-widest">Đang trực tuyến</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-start gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-primary text-on-primary rounded-tr-none" 
                    : "bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-tl-none font-medium"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-surface-container-low border-t border-outline-variant/10">
            <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-2xl border border-outline-variant/20 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI về gợi ý sách..."
                className="flex-1 bg-transparent border-none outline-none py-2 text-sm font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isLoading ? "bg-surface-container-high text-outline-variant cursor-not-allowed" : "bg-primary text-on-primary hover:scale-105 active:scale-95"
                )}
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin"></span> : <Send size={18} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-outline-variant mt-4 font-bold uppercase tracking-widest">Powered by BookVerse Intelligent Core</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
