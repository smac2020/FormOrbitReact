import React, { useState, useEffect } from "react";

const AIGeneratorForm = ({ onResponse }) => {
  const [sessionId] = useState(() => Date.now().toString());
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [typedText, setTypedText] = useState("");

  const handleTemplateChange = (value) => {
    setTemplate(value);
    if (value === "basic") {
      setPrompt(
        `Create a Basic form with HTML elements and no style for a form that contains a name, address, city, email, and phone number.`
      );
    } else if (value === "gym") {
      setPrompt(
        `Generate a fully designed, single-page "Gym Sign-Up Form" with the following features:

1. **Header Section:** Include a prominent, visually appealing title "Gym Sign-Up Form" and a short subtitle encouraging users to join, e.g., "Join our fitness community and start your journey today!"

2. **Personal Information Fields:**
   - Full Name (text input, required)
   - Email (text input with email validation, required)
   - Phone Number (text input, optional)
   - Date of Birth (date picker)

3. **Membership Options:**
   - Membership Level (dropdown with options: Basic, Silver, Gold)
   - Fitness Goal (text input or select: Lose Weight, Build Muscle, General Fitness, Flexibility)
   - Preferred Workout Time (dropdown or radio: Morning, Afternoon, Evening)

4. **Fitness Assessment:**
   - Fitness Level Slider (range 1-10, labeled "How fit are you currently?")
   - Optional short textarea for "Current Exercise Routine"

5. **Health & Safety Consent:**
   - Checkbox: "I agree to the gym's terms, conditions, and privacy policy." (required)
   - Optional checkbox: "I have any medical conditions you should be aware of" with a follow-up text input if checked

6. **Visual & UX Design:**
   - Use clear labels, placeholders, and intuitive layout.
   - Group related fields together (e.g., personal info, membership options, fitness assessment).
   - Include subtle styling: borders, spacing, and hover effects.
   - Highlight required fields visually.
   - Optional color accents for buttons and sliders (light blues, greens, or vibrant neon).

7. **Submission:**
   - A large "Sign Up" button at the bottom with hover effects.
   - Validation for required fields.
   - Confirmation message after submission: "Thank you for signing up! We will contact you soon."

Return **only HTML code** for this single-page form with semantic, well-structured elements and clean inline styling for a professional, modern look.`
      );
    } else if (value === "feedback") {
      setPrompt(
        `Build a customer feedback form with full name, email, optional phone, satisfaction dropdown 1-5.`
      );
    } else {
      setPrompt("");
    }
  };

  const helpText = `Gen AI Component Help:

This component transforms plain English descriptions into fully structured form templates, enabling rapid form creation without writing any code. Enterprises can quickly generate forms for data collection, while also gaining insights from the submissions.

Features:

AI-Powered Form Generation: Instantly convert text descriptions into functional HTML forms.

Template Selection: Choose one of three guided templates:

Basic Form: A simple form with name, address, city, email, and phone fields.

Gym Sign-Up Form: A fitness registration form with membership levels, fitness rating, and preferred workout time.

Feedback Form: A customer feedback form with satisfaction rating and optional contact fields.

Click Generate Form wtih AI to see an AI-generated form instantly, or select a template to get a pre-designed starting point. Use the help icon anytime for guidance and predictive insights.

Copy the HTML by clicking the Copy HTML and paste it into Section B - Result in the Form Converter component.  
`;

  useEffect(() => {
    if (helpOpen) {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        if (i < helpText.length) {
          setTypedText((prev) => prev + helpText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [helpOpen]);

  const extractHtmlFromReply = (text) => {
    if (!text) return "";
    const codeBlockRegex = /```html\s*([\s\S]*?)```/i;
    const match = text.match(codeBlockRegex);
    if (match && match[1]) return match[1].trim();
    const genericCodeBlockRegex = /```([\s\S]*?)```/;
    const genericMatch = text.match(genericCodeBlockRegex);
    if (genericMatch && genericMatch[1]) return genericMatch[1].trim();
    const formTagRegex = /(<form[\s\S]*<\/form>)/i;
    const formMatch = text.match(formTagRegex);
    if (formMatch && formMatch[1]) return formMatch[1].trim();
    return text.trim();
  };

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch(
        "https://kgnb1ea7la.execute-api.us-east-1.amazonaws.com/prod/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, prompt }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const assistantMsg = {
        role: "assistant",
        content: data.reply || "No reply returned.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (onResponse) onResponse(data.reply);

      const extractedHTML = extractHtmlFromReply(data.reply);
      setPrompt(extractedHTML);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error generating form: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHTML = async () => {
    if (!prompt.trim()) return;
    try {
      await navigator.clipboard.writeText(prompt);
      alert("HTML copied to clipboard!");
    } catch (err) {
      alert("Failed to copy: " + err.message);
    }
  };

  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "2rem auto",
      fontFamily: "'Poppins', sans-serif",
      color: "#c7f0f9",
      padding: "2rem",
      backgroundColor: "#0a0c17",
      borderRadius: "1rem",
    },
    card: {
      flex: "1 1 320px",
      backgroundColor: "#111427",
      borderRadius: "1rem",
      padding: "24px 20px",
      boxShadow: "0 0 12px #00e5ff66, 0 0 20px #8a2be266",
      color: "#c7f0f9",
      cursor: "default",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "scale(1.03)",
      boxShadow: "0 0 16px #00e5ff88, 0 0 28px #8a2be288",
    },
    helpIcon: {
      position: "absolute",
      top: "16px",
      right: "16px",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#ff00ff",
      zIndex: 10,
      textShadow: "0 0 4px #ff00ff, 0 0 10px #ff66ff",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
      zIndex: 9999,
    },
    modalContent: {
      maxWidth: "600px",
      maxHeight: "80vh",
      overflowY: "auto",
      backgroundColor: "#0f111a",
      border: "2px solid #00e5ff",
      borderRadius: "0.75rem",
      padding: "20px",
      color: "#c7f0f9",
      fontFamily: "'Poppins', sans-serif",
      whiteSpace: "pre-wrap",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      width: "100%",
      marginTop: "1rem",
    },
   button: {
  marginTop: "1.25rem",
  padding: "10px 20px",
  fontSize: "1.1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  color: "#00ffcc",          // <-- Dark neon text color
  backgroundColor: "#0a0c17", // Dark background for contrast
  boxShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc inset", // Neon glow
  transition: "0.2s ease",
},

    textarea: {
      width: "100%",
      height: "300px",
      backgroundColor: "#0f111a",
      color: "#c7f0f9",
      fontFamily: "monospace",
      border: "1px solid #1e40af",
      borderRadius: "0.75rem",
      padding: "12px",
    },
    chatBox: {
      width: "100%",
      minHeight: "150px",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #555",
      borderRadius: "0.75rem",
      backgroundColor: "#0f111a",
      color: "#c7f0f9",
      overflowY: "auto",
      marginBottom: "20px",
      whiteSpace: "pre-wrap",
    },
    user: { color: "#ffc107" },
    assistant: { color: "#00ff99", fontWeight: "bold" },
  };

  const [hoveredCard, setHoveredCard] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span
          style={styles.helpIcon}
          onClick={() => setHelpOpen(true)}
          title="Help"
        >
          ?
        </span>

        <h2
          style={{
            textAlign: "center",
            color: "#66ffff",
            textShadow: "0 0 1px #00e5ff, 0 0 3px #66ffff",
          }}
        >
          🔮 AI-Powered Form Generation
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#a0c8ff",
            marginBottom: "1rem",
            textShadow: "0 0 1px #00e5ff",
          }}
        >
          Describe your form or select a template. Use the help icon anytime for
          guidance.
        </p>

        {/* Template Radio Buttons */}
        <div style={{ marginBottom: "1rem", width: "100%" }}>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value="basic"
              checked={template === "basic"}
              onChange={() => handleTemplateChange("basic")}
            />{" "}
            Basic Form
          </label>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value="gym"
              checked={template === "gym"}
              onChange={() => handleTemplateChange("gym")}
            />{" "}
            Gym Sign-Up
          </label>
          <label>
            <input
              type="radio"
              value="feedback"
              checked={template === "feedback"}
              onChange={() => handleTemplateChange("feedback")}
            />{" "}
            Feedback Form
          </label>
        </div>

        <textarea
          style={styles.textarea}
          placeholder="Describe your form here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div style={styles.chatBox}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={msg.role === "user" ? styles.user : styles.assistant}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={handleAIGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Form with AI"}
          </button>
          <button
            style={styles.button}
            onClick={handleCopyHTML}
            disabled={!prompt.trim()}
          >
            Copy HTML
          </button>
        </div>

        {helpOpen && (
          <div style={styles.modalOverlay} onClick={() => setHelpOpen(false)}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {typedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGeneratorForm;
