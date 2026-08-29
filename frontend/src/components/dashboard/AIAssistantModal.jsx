import React, { useState } from 'react';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  ShieldAlert,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AIAssistantModal = ({ isOpen, onClose }) => {
  const { projects, khasras, objections } = useLandData();
  const { currentUser } = useAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste! I am the **BhoomiSetu AI Land Assistant**. I provide real-time decision support for corridor land acquisition, Bhulekh record verification, discrepancy identification, and statutory compliance under the RFCTLARR Act 2013.\n\n*Note: All outputs are advisory decision support and require administrative verification by authorized government officers.*`,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const currentProject = projects[0]; // Agra-Lucknow Highway

  const suggestedPrompts = [
    'Agra-Lucknow Highway me kitni land pending hai?',
    'Which parcels have mismatch flagged?',
    'Show pending owner verifications',
    'Summarize active citizen objections',
    'What is the compensation calculation for Khasra 101?',
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('pending') && (lower.includes('land') || lower.includes('kitni'))) {
        aiResponseText = `### Project Land Acquisition Status (${currentProject.name})\n\n- **Total Required Land:** ${currentProject.requiredLand} Acre\n- **Acquired (Possession Taken):** ${currentProject.acquiredLand} Acre\n- **Pending Acquisition:** **${currentProject.pendingLand} Acre** across active packages\n- **Verified Parcels:** ${currentProject.verifiedLand} Acre\n- **Disbursed Compensation:** ${formatCurrency(currentProject.disbursedCompensation)} / ${formatCurrency(currentProject.estimatedCompensation)}\n\n*Recommendation:* Expedite Section 11 notice issuance for remaining Stage-2 parcels in Nagla village.`;
      } else if (lower.includes('mismatch') || lower.includes('discrepancy') || lower.includes('issues')) {
        const mismatchKhasras = khasras.filter((k) => k.mismatch?.hasMismatch || k.status === 'MISMATCH_FLAGGED' || k.status === 'BOUNDARY_ISSUE');
        aiResponseText = `### AI Mismatch & Discrepancy Report\n\nFound **${mismatchKhasras.length} parcels** requiring field or document clarification:\n\n` +
          mismatchKhasras.map((k) => `- **Khasra ${k.khasraNumber} (${k.ownerName}):** ${k.mismatch?.title || k.status} — *Action:* ${k.mismatch?.recommendation || 'Joint survey required.'}`).join('\n') +
          `\n\n> ⚠️ *Decision Rule:* AI has flagged these anomalies for review. Final mutation is strictly subject to Tehsildar & SLAO orders.`;
      } else if (lower.includes('objection') || lower.includes('claims') || lower.includes('sunita')) {
        aiResponseText = `### Active Citizen Objections (${objections.length} Total)\n\n` +
          objections.map((o) => `- **${o.id} (Khasra ${o.khasraNumber} - ${o.ownerName}):**\n  - *Category:* ${o.category}\n  - *Status:* **${o.status}**\n  - *Claim:* "${o.reason}"`).join('\n\n') +
          `\n\n*Actionable:* Hearing for Khasra 103 (Sunita Devi) is scheduled for 15-Apr-2026.`;
      } else if (lower.includes('101') || lower.includes('ram kumar')) {
        const k101 = khasras.find((k) => k.khasraNumber === '101');
        aiResponseText = `### Land Record Summary: Khasra 101\n\n- **Registered Owner:** ${k101.ownerName} (${k101.fatherName})\n- **Area:** ${k101.areaAcre} Acre (${k101.landType})\n- **Village & District:** ${k101.village}, ${k101.district}\n- **Current Status:** **${k101.status}**\n- **Estimated Compensation:** **${formatCurrency(k101.totalCompensation)}** (Circle rate ₹20 Lakh/Acre × 2.5 + Solatium 100%)\n- **Bhulekh RoR Match:** 100% Clean title verified.`;
      } else if (lower.includes('risk') || lower.includes('high risk')) {
        aiResponseText = `### AI Project Risk Analysis (${currentProject.name})\n\n- **Overall Risk Index:** **${currentProject.aiRiskLevel} (${currentProject.aiRiskScore}/100)**\n- **Identified Risk Factors:**\n` +
          currentProject.riskFactors.map((f) => `  - 🔴 ${f}`).join('\n') +
          `\n\n*Recommended Mitigation:* Prioritize hearing notices for contested plots and synchronize offline Khatauni mutation fascicles.`;
      } else {
        aiResponseText = `Thank you for your query regarding **${currentProject.name}**.\n\nOur AI engine has analyzed all active cadastral polygons and Bhulekh synchronization logs. Currently:\n- **${currentProject.affectedOwners} Land Owners** are recorded in the corridor.\n- **${currentProject.acquiredLand} Acre** is in possession, with **${currentProject.pendingLand} Acre** in active verification.\n\nPlease choose from the suggested prompts below or specify a Khasra number for deep inspection.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[2000] overflow-hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl h-[600px] sm:h-[650px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gov-blue-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-gov-blue-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-lg bg-gov-saffron-600/30 border border-gov-saffron-500/50">
              <Sparkles className="w-5 h-5 text-gov-saffron-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">BhoomiSetu AI Land Assistant</h3>
                <span className="bg-gov-green-700 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                  Decision Support
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Context: {currentProject.name} (PRJ-001)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-gov-blue-800 transition bg-gov-blue-950 border border-gov-blue-700"
            title="Close AI Assistant (✕)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center gap-2 text-[10px] sm:text-[11px] text-amber-900 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Statutory Rule:</strong> AI provides advisory decision support only. Final decisions must be made by authorized government officers.
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
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
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs leading-relaxed shadow-sm ${
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
              <span>Analyzing Cadastral Records & Bhulekh database...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 bg-white hover:bg-gov-blue-50 hover:text-gov-blue-900 border border-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded-full font-medium transition shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI anything about land records, mismatches, or project status..."
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 disabled:opacity-50 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
