import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface Message {
  id: string;
  text: string;
  sender: "bizi" | "user";
  timestamp: Date;
}

interface BiziAssistantProps {
  onboardingMode?: boolean;
  currentStep?: string;
}

export function BiziAssistant({ onboardingMode = false, currentStep }: BiziAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: onboardingMode 
        ? "Hi! I'm Bizi, your AI business companion. I'm here to help you get started with BizMod. Feel free to ask me anything!" 
        : "Hello! I'm Bizi. How can I help you today?",
      sender: "bizi",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const { getThemeClasses } = useTheme();
  const theme = getThemeClasses();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateResponse(inputText.toLowerCase());
      const biziMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "bizi",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, biziMessage]);
    }, 800);
  };

  const generateResponse = (input: string): string => {
    // Simple response logic - in production, this would connect to actual AI
    if (input.includes("invoice")) {
      return "To create an invoice, go to Sales > Invoices > New Invoice. I can guide you through the process step by step!";
    }
    if (input.includes("help") || input.includes("how")) {
      return "I'm here to help! You can ask me about creating invoices, managing inventory, viewing reports, or anything else about BizMod.";
    }
    if (input.includes("sales") || input.includes("revenue")) {
      return "Your sales dashboard shows all your transactions. Would you like me to show you your top-selling products or recent sales trends?";
    }
    if (input.includes("inventory") || input.includes("stock")) {
      return "I can help you manage inventory! You can add products, track stock levels, and set up automatic reorder alerts.";
    }
    return "That's a great question! While I'm still learning, you can check our help center or ask me to guide you through specific features like invoicing, inventory, or reports.";
  };

  return (
    <>
      {/* Bizi Avatar - Always visible */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 ${theme.primaryGradient} text-white rounded-full shadow-2xl hover:shadow-3xl transition-all p-1`}
        style={{ width: "64px", height: "64px" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          boxShadow: isOpen
            ? "0 0 0 0 rgba(99, 102, 241, 0)"
            : [
                "0 0 0 0 rgba(99, 102, 241, 0.7)",
                "0 0 0 20px rgba(99, 102, 241, 0)",
              ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          },
        }}
      >
        {/* Bizi Avatar */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isOpen ? (
            <X size={28} />
          ) : (
            <>
              {/* Simple robot/AI face */}
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                {/* Head */}
                <circle cx="28" cy="28" r="22" fill="white" opacity="0.95" />
                
                {/* Eyes */}
                <circle cx="20" cy="24" r="3" fill="#6366f1" />
                <circle cx="36" cy="24" r="3" fill="#6366f1" />
                
                {/* Smile */}
                <path
                  d="M 18 32 Q 28 38 38 32"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Antenna */}
                <line x1="28" y1="6" x2="28" y2="10" stroke="white" strokeWidth="2" />
                <circle cx="28" cy="4" r="2" fill="white" />
                
                {/* Sparkle effect */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "28px 28px" }}
                >
                  <circle cx="48" cy="20" r="1.5" fill="white" opacity="0.8" />
                  <circle cx="8" cy="36" r="1" fill="white" opacity="0.6" />
                </motion.g>
              </svg>
              
              {/* Notification dot for new messages */}
              {messages.length > 1 && !isOpen && (
                <motion.div
                  className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                />
              )}
            </>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className={`${theme.primaryGradient} text-white p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="22" fill="white" opacity="0.95" />
                    <circle cx="20" cy="24" r="3" fill="#6366f1" />
                    <circle cx="36" cy="24" r="3" fill="#6366f1" />
                    <path
                      d="M 18 32 Q 28 38 38 32"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    Bizi
                    <Sparkles size={16} className="text-yellow-300" />
                  </h3>
                  <p className="text-xs opacity-90">Your AI Business Companion</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? `${theme.primaryGradient} text-white`
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {messages.length > 0 && messages[messages.length - 1].sender === "user" && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask Bizi anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
                />
                <motion.button
                  onClick={handleSendMessage}
                  className={`${theme.buttonPrimary} px-4 py-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputText.trim()}
                >
                  <Send size={20} />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Voice interaction coming soon!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
