import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Film, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_MESSAGE = {
  sender: 'bot',
  text: "Hey there! 🎬 I'm CineAI, your personal cinema assistant.\n\nLet's find you the perfect movie in 3 quick questions!\n\n👉 **Question 1:** What language or film industry are you in the mood for?",
  step: 1,
  options: [
    { label: '🌐 Hollywood / English', value: 'en', type: 'language' },
    { label: '🇮🇳 Telugu (Tollywood)', value: 'te', type: 'language' },
    { label: '🇮🇳 Hindi (Bollywood)', value: 'hi', type: 'language' },
    { label: '🇮🇳 Tamil (Kollywood)', value: 'ta', type: 'language' },
    { label: '🇮🇳 Malayalam', value: 'ml', type: 'language' },
    { label: '🇰🇷 Korean Cinema', value: 'ko', type: 'language' },
    { label: '🇯🇵 Anime / Japanese', value: 'ja', type: 'language' },
    { label: '🌍 Any / Surprise Me', value: 'all', type: 'language' }
  ],
  movies: []
};

const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [currentStep, setCurrentStep] = useState(1);
  const [conversationContext, setConversationContext] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendQuery = async (queryText, stepOverride = null, contextOverride = null) => {
    if (!queryText.trim() || loading) return;

    const userMsg = { sender: 'user', text: queryText, movies: [] };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const stepToSend = stepOverride !== null ? stepOverride : currentStep;
    const contextToSend = contextOverride !== null ? contextOverride : conversationContext;

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: queryText,
          step: stepToSend,
          context: contextToSend
        })
      });

      if (!res.ok) throw new Error('AI Assistant is currently offline');

      const data = await res.json();

      if (data.context) {
        setConversationContext((prev) => ({ ...prev, ...data.context }));
      }
      if (data.step) {
        setCurrentStep(data.step);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.response,
          step: data.step,
          options: data.options || [],
          movies: data.recommended_movies || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Oops, I had trouble connecting. Let's try again or feel free to click any suggestion below!",
          options: [{ label: '🔄 Start Over', value: 'start' }],
          movies: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  const handleOptionClick = (option) => {
    if (option.value === 'start' || option.value === 'reset') {
      handleRestart();
      return;
    }

    let updatedContext = { ...conversationContext };
    if (option.type === 'language') updatedContext.language = option.value;
    if (option.type === 'genre') updatedContext.genre = option.value;
    if (option.type === 'era') updatedContext.era = option.value;

    setConversationContext(updatedContext);
    sendQuery(option.label || option.value, currentStep, updatedContext);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setConversationContext({});
    setMessages([INITIAL_MESSAGE]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-brand-red via-red-600 to-amber-600 text-white font-black rounded-full shadow-2xl hover:scale-105 active:scale-95 transition duration-200 cursor-pointer border border-white/20 group"
      >
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse group-hover:rotate-12 transition duration-200" />
        <span className="tracking-wide">Ask CineAI Assistant</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed right-3 sm:right-6 bottom-4 sm:bottom-6 z-50 glass-panel rounded-2xl shadow-2xl border border-white/15 transition-all duration-300 flex flex-col overflow-hidden ${
        isMinimized
          ? 'w-[290px] h-[55px]'
          : 'w-[94vw] sm:w-[430px] md:w-[480px] h-[84vh] max-h-[640px]'
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-neutral-950/80 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red shadow">
            <Bot className="w-4 h-4 text-brand-red" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white leading-none">CineAI Assistant</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            {!isMinimized && (
              <span className="text-[10px] text-neutral-400 font-medium mt-0.5 inline-block">
                Interactive Movie Concierge
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRestart}
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-amber-400 transition cursor-pointer"
            title="Start Over Questionnaire"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleChat}
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-brand-red transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-neutral-950/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[92%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-neutral-700 text-white'
                      : 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-3 w-full min-w-0">
                  {/* Text Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-red to-brand-dark-red text-white rounded-tr-none font-medium'
                        : 'bg-neutral-900 text-neutral-100 border border-white/10 rounded-tl-none'
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {msg.text}
                  </div>

                  {/* Interactive Option Chips */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionClick(opt)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-brand-red/20 border border-white/15 hover:border-brand-red/50 text-neutral-200 hover:text-white text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recommended Movie Cards */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2 w-full">
                      {msg.movies.map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => {
                            navigate(`/movie/${movie.id}`);
                            setIsOpen(false);
                          }}
                          className="group bg-neutral-900/90 hover:bg-neutral-850 rounded-xl border border-white/10 hover:border-brand-red/60 overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="relative aspect-[2/3] w-full bg-neutral-800 overflow-hidden">
                            {movie.poster_path ? (
                              <img
                                src={
                                  movie.poster_path.startsWith('http')
                                    ? movie.poster_path
                                    : `https://image.tmdb.org/t/p/w342${movie.poster_path.startsWith('/') ? '' : '/'}${movie.poster_path}`
                                }
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              style={{ display: movie.poster_path ? 'none' : 'flex' }}
                              className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-neutral-800 to-black"
                            >
                              <Film className="w-6 h-6 text-brand-red mb-1.5" />
                              <span className="text-[10px] font-bold text-white line-clamp-2">{movie.title}</span>
                            </div>

                            {/* Match Score Badge */}
                            {movie.match_score && (
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-500/90 text-black font-black text-[9px] shadow">
                                {movie.match_score}% Match
                              </div>
                            )}
                          </div>

                          <div className="p-2.5 space-y-1.5 flex flex-col justify-between flex-grow">
                            <div>
                              <h4 className="text-white text-xs font-bold line-clamp-1 group-hover:text-brand-red transition">
                                {movie.title}
                              </h4>
                              {movie.recommendation_reason && (
                                <p className="text-neutral-400 text-[10px] line-clamp-2 leading-tight mt-1">
                                  {movie.recommendation_reason}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                              <span className="text-neutral-500 font-medium">
                                {movie.release_date ? movie.release_date.split('-')[0] : 'Feature'}
                              </span>
                              <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{movie.vote_average ? Number(movie.vote_average).toFixed(1) : '8.0'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30 flex-shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-neutral-900 border border-white/10 text-neutral-300 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="text-xs text-neutral-400 font-medium">CineAI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Footer / Input Form */}
          <div className="p-3 bg-neutral-950/90 border-t border-white/10 space-y-2">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type anything (e.g., 'Telugu action' or 'movies like Inception')..."
                className="flex-grow bg-neutral-900 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm border border-white/10 focus:border-brand-red outline-none transition placeholder:text-neutral-500"
                disabled={loading}
              />
              <button
                type="submit"
                className={`p-2.5 rounded-xl text-white transition flex-shrink-0 ${
                  input.trim() && !loading
                    ? 'bg-brand-red hover:bg-brand-dark-red cursor-pointer shadow-md'
                    : 'bg-neutral-850 text-neutral-600'
                }`}
                disabled={!input.trim() || loading}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistantChat;
