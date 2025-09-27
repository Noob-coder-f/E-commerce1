// frontend/src/components/ChatBox.jsx

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaComments } from "react-icons/fa";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false); // AI typing indicator

  const boxRef = useRef(null); // for auto-scroll

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages, isOpen, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError("");

    pushMessage({ id: Date.now() + "-u", role: "user", text: input.trim() });
    const userQuery = input.trim();
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}api/ai/chat`, {
        message: userQuery,
      });

      const { reply, products = [] } = res.data;

      pushMessage({
        id: Date.now() + "-b",
        role: "assistant",
        text: reply,
        products: Array.isArray(products) ? products : [],
      });
    } catch (e) {
      console.error("Chat error", e);
      setError("Failed to reach AI service. Please try again.");
      pushMessage({
        id: Date.now() + "-be",
        role: "assistant",
        text: "Sorry — something went wrong.",
      });
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Styles with animation
  const styles = {
    container: {
      width: 360,
      maxWidth: "90vw",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      fontFamily: "Inter, system-ui, Arial",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.3s ease, opacity 0.3s ease",
    },
    header: {
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    box: {
      height: 320,
      overflowY: "auto",
      padding: 8,
      background: "#fafafa",
      borderRadius: 8,
      border: "1px solid #f0f0f0",
    },
    rowUser: { textAlign: "right", margin: "6px 0" },
    rowBot: { textAlign: "left", margin: "6px 0" },
    bubbleUser: {
      display: "inline-block",
      padding: "8px 12px",
      background: "#DCF8C6",
      borderRadius: 16,
      maxWidth: "85%",
    },
    bubbleBot: {
      display: "inline-block",
      padding: "8px 12px",
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 16,
      maxWidth: "85%",
    },
    productsWrap: { marginTop: 8 },
    card: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      border: "1px solid #eee",
      padding: 8,
      borderRadius: 8,
      background: "#fff",
      marginTop: 8,
    },
    img: { width: 56, height: 56, objectFit: "cover", borderRadius: 6 },
    name: { fontWeight: 600 },
    price: { fontSize: 13, color: "#334155" },
    inputRow: { display: "flex", gap: 8, marginTop: 8 },
    ta: { flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" },
    btn: { padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" },
    toggleIcon: {
      position: "fixed",
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: "50%",
      background: "green",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 1000,
    },
    typing: {
      fontStyle: "italic",
      color: "#555",
      fontSize: 14,
      marginTop: 4,
    },
  };

  return (
    <>
      {/* Chat icon toggle */}
      {!isOpen && (
        <div style={styles.toggleIcon} onClick={() => setIsOpen(true)}>
          <FaComments />
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 1000,
            transform: isOpen ? "scale(1)" : "scale(0.8)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div style={styles.container}>
            <div style={styles.header}>
              AI Shopping Assistant
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div style={styles.box} ref={boxRef}>
              {messages.map((m) => (
                <div key={m.id} style={m.role === "user" ? styles.rowUser : styles.rowBot}>
                  <div style={m.role === "user" ? styles.bubbleUser : styles.bubbleBot}>
                    {m.text}
                  </div>

                  {m.products && m.products.length > 0 && (
                    <div style={styles.productsWrap}>
                      {m.products.map((p) => (
                        <div key={p._id} style={styles.card}>
                          <img src={p.cardimage} alt={p.cardname} style={styles.img} />
                          <div>
                            <div style={styles.name}>{p.cardname}</div>
                            <div style={styles.price}>₹{p.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && <div style={styles.typing}>AI is typing...</div>}
            </div>

            {error && <div style={{ color: "red", marginTop: 4 }}>{error}</div>}

            <div style={styles.inputRow}>
              <textarea
                style={styles.ta}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button style={styles.btn} onClick={sendMessage} disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
