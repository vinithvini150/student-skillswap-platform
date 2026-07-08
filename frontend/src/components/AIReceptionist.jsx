import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../services/api.js";

function AIReceptionist() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user.name || "there"}! I am the SkillSwap AI receptionist. Ask me about requests, classes, your profile, calendar, or support.`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || loading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: text }
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: text
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            response.data.reply ||
            "I could not prepare a reply. Please try again."
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "I am unavailable right now. Please try again later."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const askQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="ai-receptionist">
      {isOpen && (
        <section className="ai-chat-window">
          <header className="ai-chat-header">
            <div className="ai-title">
              <div className="ai-avatar">
                <Bot size={21} />
              </div>

              <div>
                <h2>SkillSwap Receptionist</h2>
                <p>
                  <span className="ai-online-dot" />
                  AI assistant online
                </p>
              </div>
            </div>

            <button
              type="button"
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI receptionist"
            >
              <X size={20} />
            </button>
          </header>

          <div className="ai-chat-messages">
            {messages.map((message, index) => (
              <div
                className={`ai-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.role === "assistant" && (
                  <Bot size={17} className="ai-message-icon" />
                )}

                <p>{message.content}</p>
              </div>
            ))}

            {loading && (
              <div className="ai-message assistant ai-typing">
                <Bot size={17} className="ai-message-icon" />
                <p>Thinking...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="ai-quick-questions">
            <button
              type="button"
              onClick={() => askQuickQuestion("How do I send a request?")}
            >
              Send a request
            </button>

            <button
              type="button"
              onClick={() => askQuickQuestion("How do I plan a class?")}
            >
              Plan a class
            </button>

            <button
              type="button"
              onClick={() => askQuickQuestion("Where is Help and Contact?")}
            >
              Contact support
            </button>
          </div>

          <form className="ai-chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask SkillSwap Assistant..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-launch-button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label="Open AI receptionist"
        title="Ask SkillSwap AI"
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
        {!isOpen && <Sparkles size={15} className="ai-sparkle" />}
      </button>
    </div>
  );
}

export default AIReceptionist;