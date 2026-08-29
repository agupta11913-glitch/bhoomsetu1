import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  X,
  ArrowLeft,
  Home,
} from 'lucide-react';

import { askAIAssistantApi } from '../../services/api/aiApi';
import { useAuth } from '../../context/AuthContext';

export const AIAssistantPage = () => {
  const navigate = useNavigate();
  const { projects, khasras, objections, setActiveKhasraId, setMapCenterKhasra, showToast } = useLandData();
  const { currentUser, currentRole } = useAuth();
  const currentProject = projects[0] || { name: 'Delhi–Meerut Expressway (NH-348)' };

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste! I am the **BhoomiSetu AI Land Assistant**.\n\nI provide instant statutory analysis, Bhulekh discrepancy checks, and compensation estimation for the **${currentProject.name}** corridor.\n\n*Statutory Notice: All AI insights are advisory decision support and do not constitute binding judicial orders.*`,
      timestamp: 'Just now',
      action: null,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Mere district me kitne project hain?',
    'Kaunse project late hain?',
    'Meri land ka status kya hai?',
    'Compensation kab milega?',
    'GIS map kholo',
  ];

  const handleClose = () => {
    navigate('/');
  };

  const handleExecuteAction = (action) => {
    if (!action) return;
    if (action.payload?.khasraNumber) {
      setActiveKhasraId(action.payload.khasraNumber);
      setMapCenterKhasra(action.payload.khasraNumber);
    }
    if (action.path) {
      navigate(action.path);
      showToast('AI Action', action.label || 'Navigated to workspace', 'success');
    }
  };

  const handleSend = async (text) => {
    const query = (text || inputQuery).trim();
    if (!query) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await askAIAssistantApi({
        message: query,
        query,
        currentPage: '/ai-assistant',
        projectId: 'PRJ-001',
        currentProjectId: 'PRJ-001',
        currentDistrict: currentUser?.district || 'Agra',
        userRole: currentRole || currentUser?.role,
        userEmail: currentUser?.email,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer || 'Is information ka data abhi available nahi hai.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: res.action || null,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Is information ka data abhi available nahi hai.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Prominent Close / Back Button */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-gov-saffron-600 to-amber-500 text-white shadow shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-800 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                Decision Support AI
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">BhoomiSetu Suite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              BhoomiSetu AI Land Assistant
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Query corridor statistics, detect record mismatches, and summarize citizen objections in English & Hindi.
            </p>
          </div>
        </div>

        {/* Action Controls & Close Button */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={handleClose}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition transform active:scale-95"
            title="Close AI Assistant & Return to Dashboard"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close AI (बंद करें)</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov h-[600px] sm:h-[650px] flex flex-col overflow-hidden">
        {/* Top Mini Bar with Quick Close */}
        <div className="bg-gov-blue-900 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-gov-saffron-500" />
            <span className="text-xs font-bold text-slate-100">Live AI Session ({currentProject.name})</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-gov-blue-800 transition"
            title="Close AI Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Statutory Rule:</strong> AI provides decision support only. Final decisions must be made by authorized government officers.
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-gov-blue-900 text-white'
                    : 'bg-gradient-to-tr from-gov-saffron-600 to-amber-500 text-white shadow'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gov-blue-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line prose prose-xs max-w-none">
                  {msg.text}
                </div>
                <span
                  className={`block text-[10px] mt-2 ${
                    msg.sender === 'user' ? 'text-slate-300 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 text-gov-saffron-500 animate-spin" />
              <span>Analyzing Cadastral Records & Bhulekh RoR database...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="shrink-0 bg-white hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-900 border border-slate-200 text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium transition shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI anything about land records, mismatches, or project status..."
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 disabled:opacity-50 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow transition shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
