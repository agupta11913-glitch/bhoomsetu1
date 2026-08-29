import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLandData } from '../../context/LandDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { askAIAssistantApi } from '../../services/api/aiApi';
import { ErrorBoundary } from '../common/ErrorBoundary';
import {
  Sparkles,
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  MapPin,
  Compass,
  Layers,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Mic,
  MicOff,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const ContextAwareAIAssistantContent = ({ externalOpen, onExternalClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { currentUser, currentRole } = useAuth();
  const { setActiveKhasraId, setMapCenterKhasra, showToast } = useLandData();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync external open request (from top navbar "AI Assist" button)
  useEffect(() => {
    if (externalOpen !== undefined) {
      setIsOpen(externalOpen);
      if (externalOpen) setIsMinimized(false);
    }
  }, [externalOpen]);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! BhoomiSetu me main aapki kya madad kar sakta hoon? Aap mujhse land acquisition status, project progress, compensation, delayed cases ya GIS map ke baare me pooch sakte hain.',
      timestamp: 'Just now',
      action: null,
      followUps: ['Mere district me kitne project hain?', 'Meri land ka status kya hai?', 'Kaunse project late hain?'],
    },
  ]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Extract page context
  const currentPath = location.pathname;
  const currentProjectId = params.projectId || (currentPath.includes('PRJ-001') ? 'PRJ-001' : (currentPath.includes('PRJ-002') ? 'PRJ-002' : null));
  const currentCaseId = params.caseId || (currentPath.includes('CASE-2026-DME-0101') ? 'CASE-2026-DME-0101' : null);
  const currentDistrict = currentUser?.district || 'Agra';
  const roleName = currentRole || currentUser?.role || 'CITIZEN';

  // Dynamic context tag for top header
  const getContextLabel = () => {
    if (currentProjectId) return `Project: ${currentProjectId}`;
    if (currentCaseId) return `Case: ${currentCaseId}`;
    if (currentPath.includes('/gis-map') || currentPath.includes('/map')) return 'GIS Map View';
    if (currentPath.includes('/citizen')) return 'Citizen Portal';
    if (currentPath.includes('/district')) return `District: ${currentDistrict}`;
    if (currentPath.includes('/state')) return 'State Secretariat';
    if (currentPath.includes('/central')) return 'PM Gati Shakti';
    if (currentPath.includes('/admin')) return 'System Admin';
    return 'BhoomiSetu Portal';
  };

  // Dynamic role-based suggested prompt pills
  const getRolePrompts = () => {
    const raw = roleName.toUpperCase().replace(/^ROLE_/, '');
    switch (raw) {
      case 'CITIZEN':
        return [
          'Meri land ka status kya hai?',
          'Compensation kab milega?',
          'Mera Khasra 101 map pe dikhao',
          'R&R benefits kya hain?',
        ];
      case 'REVENUE_OFFICER':
      case 'GOVERNMENT_OFFICER':
        return [
          'Kitne cases pending verification hain?',
          'Khasra 101 Bhulekh RoR match report',
          'Field verification map kholo',
          'Mismatch flagged parcels kaunse hain?',
        ];
      case 'TEHSILDAR':
        return [
          'Active citizen objections kitne hain?',
          'Tehsil acquisition status kya hai?',
          'Hearing schedule dikhao',
          'Khasra 103 dispute review',
        ];
      case 'PROJECT_AGENCY':
      case 'EXECUTIVE_OFFICER':
        return [
          'Ye project kitna complete hua?',
          'Utility shifting bottlenecks kya hain?',
          'Project PRJ-001 ka map kholo',
          'Civil possession handover status',
        ];
      case 'DISTRICT_AUTHORITY':
      case 'DISTRICT_MAGISTRATE':
        return [
          'Mere district me kitne project hain?',
          'Kaunse project late hain?',
          'Total compensation disbursement kitna hua?',
          'Delayed cases check karo',
        ];
      case 'STATE_GOVERNMENT':
        return [
          'State corridors me kitna land acquire hua?',
          'District-wise progress comparison',
          'High Court stay escalations',
          'Forest clearances status',
        ];
      case 'CENTRAL_MINISTRY':
        return [
          'Pan-India PM Gati Shakti progress',
          'Inter-state corridor roadblocks',
          'Multi-state bottleneck report',
          'National project milestones',
        ];
      case 'ADMIN':
      default:
        return [
          'System health and active sessions',
          'Total registered users across roles',
          'District projects overview',
          'Delayed projects summary',
        ];
    }
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Speech Not Supported', 'Your browser does not support Speech Recognition. Please type your query.', 'info');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Supports Hindi / Hinglish / English
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Execute interactive website action
  const handleExecuteAction = (action) => {
    if (!action) return;

    const parcelId = action.parcelId || action.payload?.khasraNumber || action.payload?.parcelId;
    const projId = action.projectId || action.payload?.projectId;

    if (parcelId) {
      setActiveKhasraId(parcelId);
      setMapCenterKhasra(parcelId);
    }

    if (action.path) {
      navigate(action.path);
      showToast('AI Action Executed', action.label || 'Navigated to target workspace view', 'success');
    }
  };

  // Send message
  const handleSend = async (customText) => {
    const text = (customText || inputQuery).trim();
    if (!text) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await askAIAssistantApi({
        message: text,
        query: text,
        currentPage: currentPath,
        projectId: currentProjectId,
        currentProjectId,
        caseId: currentCaseId,
        currentCaseId,
        currentDistrict,
        userRole: roleName,
        userEmail: currentUser?.email,
      });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer || 'Is information ka data abhi available nahi hai.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action || null,
        followUps: response.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If response includes an automatic map action requested explicitly
      if (response.action && (text.toLowerCase().includes('kholo') || text.toLowerCase().includes('open') || text.toLowerCase().includes('dikhao'))) {
        handleExecuteAction(response.action);
      }
    } catch (err) {
      console.error('AI Processing Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Is information ka data abhi available nahi hai.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: null,
          followUps: ['Mere district me kitne project hain?', 'GIS map kholo'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onExternalClose) onExternalClose();
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Namaste! BhoomiSetu me main aapki kya madad kar sakta hoon? Aap mujhse land acquisition status, project progress, compensation, delayed cases ya GIS map ke baare me pooch sakte hain.',
        timestamp: 'Just now',
        action: null,
        followUps: ['Mere district me kitne project hain?', 'Meri land ka status kya hai?', 'Kaunse project late hain?'],
      },
    ]);
  };

  return (
    <>
      {/* 1. Floating Trigger Button (Bottom-Right, above mobile bottom bar) */}
      {!isOpen && (
        <div className="fixed bottom-16 md:bottom-6 right-3 sm:right-6 z-[1200] flex items-center gap-2 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-gov-blue-900 via-indigo-900 to-purple-950 hover:from-gov-blue-800 hover:to-purple-900 text-white px-3 sm:pl-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-full shadow-gov-lg hover:shadow-2xl border-2 border-gov-saffron-500/70 hover:border-gov-saffron-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
            title="Ask Context-Aware AI Land Acquisition Assistant"
          >
            {/* Pulsing indicator ring */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-saffron-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-gov-saffron-500 border-2 border-gov-blue-950" />
            </span>

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gov-saffron-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[11px] sm:text-xs font-black tracking-wide text-white">AI Assistant</span>
                <span className="bg-gov-saffron-500 text-slate-950 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  SIH 2026
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-300 leading-tight hidden xs:block">
                Ask in Hindi / Hinglish / English
              </p>
            </div>
          </button>
        </div>
      )}

      {/* 2. Chat Modal Window */}
      {isOpen && (
        <div
          className={`fixed inset-x-2 bottom-16 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[1300] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-auto sm:w-80 h-14 sm:h-16'
              : 'w-auto sm:w-[460px] md:w-[500px] h-[78vh] sm:h-[640px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gov-blue-950 via-slate-900 to-indigo-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-gov-blue-800 shrink-0 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gov-saffron-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    BhoomiSetu AI Assistant
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                    Live NLU
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 truncate">
                  <span className="text-gov-saffron-400 font-semibold">{getContextLabel()}</span>
                  <span>•</span>
                  <span className="text-slate-400">{roleName.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Restart Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-rose-900/60 rounded-lg transition"
                title="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Banner */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-600 shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <Compass className="w-3 h-3 text-gov-blue-900 shrink-0" />
                  <span className="truncate">
                    Active Scope: <strong className="text-slate-900">{currentDistrict} District</strong> ({roleName})
                  </span>
                </div>
                <span className="text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-full shrink-0">
                  RBAC Authorized
                </span>
              </div>

              {/* Chat Message Scrollport */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-100/60">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-gov-blue-900 text-gov-saffron-400 flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs leading-relaxed space-y-2 ${
                          isUser
                            ? 'bg-gov-blue-900 text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        }`}
                      >
                        {/* Text formatting with bold and bullet points */}
                        <div className="whitespace-pre-line break-words space-y-1">
                          {msg.text.split('\n').map((line, idx) => {
                            if (line.startsWith('### ')) {
                              return (
                                <h4 key={idx} className="font-extrabold text-gov-blue-900 text-xs mt-1">
                                  {line.replace('### ', '')}
                                </h4>
                              );
                            }
                            if (line.startsWith('- ')) {
                              return (
                                <div key={idx} className="flex items-start gap-1.5 pl-1 text-[11.5px]">
                                  <span className="text-gov-saffron-600 font-bold">•</span>
                                  <span>{renderFormattedText(line.replace('- ', ''))}</span>
                                </div>
                              );
                            }
                            return <p key={idx}>{renderFormattedText(line)}</p>;
                          })}
                        </div>

                        {/* Interactive Action Button if returned by AI */}
                        {msg.action && (
                          <div className="pt-1.5 border-t border-slate-100">
                            <button
                              onClick={() => handleExecuteAction(msg.action)}
                              className="w-full bg-gradient-to-r from-gov-saffron-500 to-amber-500 hover:from-gov-saffron-600 hover:to-amber-600 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition transform active:scale-95"
                            >
                              <span>{msg.action.label || 'View in Portal'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <span
                          className={`block text-[9px] text-right font-medium ${
                            isUser ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-gov-blue-900 text-gov-saffron-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 bg-gov-blue-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gov-blue-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gov-blue-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] font-bold text-slate-400 ml-1">Analyzing database & GIS layers...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="bg-white border-t border-slate-200 p-2 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gov-saffron-500" />
                  Try:
                </span>
                {getRolePrompts().map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 bg-slate-100 hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-900 hover:border-gov-blue-300 border border-slate-200 rounded-full px-2.5 py-1 text-[10.5px] font-medium transition active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-white border-t border-slate-200 p-3 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Hindi / Hinglish me poochein (e.g. kitne project hain?)..."
                    className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-gov-blue-900 focus:ring-1 focus:ring-gov-blue-900 outline-none transition placeholder:text-slate-400"
                  />

                  {/* Voice Input Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    title={isListening ? 'Listening... click to stop' : 'Voice Input (Hindi/English)'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isTyping}
                    className="bg-gov-blue-900 hover:bg-gov-blue-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-xs flex items-center justify-center shrink-0 active:scale-95"
                    title="Send Query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

// Simple helper to parse **bold** text in markdown without heavy extra dependencies
const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export const ContextAwareAIAssistant = (props) => (
  <ErrorBoundary fallbackTitle="AI Assistant Widget Loading">
    <ContextAwareAIAssistantContent {...props} />
  </ErrorBoundary>
);

export default ContextAwareAIAssistant;
