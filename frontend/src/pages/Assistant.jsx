import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { askAssistant } from "../services/api";
import "./Assistant.css";

function Assistant() {
  const location = useLocation();
  const initialPlant = location.state?.plantName || "";

  const [activePlant, setActivePlant] = useState(initialPlant);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: initialPlant
        ? `🌱 Hello! I'm PlantAI Assistant. I am ready to assist you with care, watering, fertilizers, or troubleshooting for ${initialPlant}. What would you like to know?`
        : "🌱 Hello! I'm PlantAI Assistant. Ask me anything about plant care, watering schedules, sunlight needs, soil mixtures, repotting, or disease remedies.",
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await askAssistant(query, activePlant);
      const botAnswer =
        response.answer || response.message || "I apologize, but I could not formulate an answer right now.";

      if (response.plant_name && !activePlant) {
        setActivePlant(response.plant_name);
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botAnswer }]);
    } catch (err) {
      console.error("Assistant chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Could not reach the PlantAI assistant service. Please check your backend connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🤖</span> Conversational Botanical Intelligence
        </div>
        <h1 className="page-title">AI Plant Assistant</h1>
        <p className="page-subtitle">
          Ask questions about watering frequencies, sunlight requirements, pest control, soil types, and plant health problems.
        </p>
      </header>

      <div className="assistant-box">
        <div className="plant-card chat-card">
          {/* Header Bar */}
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🌿</span>
              <div>
                <strong style={{ color: "var(--text-main)", fontSize: "15px" }}>Plant Care Bot</strong>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Online & Ready</div>
              </div>
            </div>

            <div className="chat-context-tag">
              <span>🎯 Focus:</span>
              <input
                type="text"
                value={activePlant}
                placeholder="General / Select Plant"
                onChange={(e) => setActivePlant(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontWeight: "700",
                  color: "var(--primary-dark)",
                  outline: "none",
                  width: "120px",
                  fontSize: "13px",
                }}
                title="Click to change active plant focus"
              />
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-row ${msg.sender === "user" ? "message-user" : "message-bot"}`}
              >
                <div className={`avatar ${msg.sender === "user" ? "avatar-user" : "avatar-bot"}`}>
                  {msg.sender === "user" ? "👤" : "🌱"}
                </div>
                <div className={`message-bubble ${msg.sender === "user" ? "bubble-user" : "bubble-bot"}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row message-bot">
                <div className="avatar avatar-bot">🌱</div>
                <div className="message-bubble bubble-bot" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="spinner" style={{ borderColor: "#15803d", borderTopColor: "transparent" }}></span>
                  <span>PlantAI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="suggestions-bar">
            {[
              "💧 How often should I water?",
              "☀️ What sunlight is best?",
              "🌱 What potting soil to use?",
              "🍂 Why are the leaves turning yellow?",
              "🛡️ How do I treat pests and bugs?",
            ].map((chip, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(chip.replace(/^[^\w]+/, ""))}
                disabled={loading}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            className="chat-input-container"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Ask any plant care or troubleshooting question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Assistant;
