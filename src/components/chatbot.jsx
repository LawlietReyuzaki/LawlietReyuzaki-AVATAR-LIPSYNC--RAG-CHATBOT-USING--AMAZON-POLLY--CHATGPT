import React, { useState, useEffect } from 'react';

export const Chatbot = ({ onResponse }) => {
  const [messages, setMessages] = useState([]); // Stores conversation
  const [input, setInput] = useState('');       // Stores user input
  const [loading, setLoading] = useState(false); // Indicates when the bot is processing

  // Initial welcome message with emoji
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: '👋 Hi! I am the customer support chat for Lowcost Lasers. How may I help you?' }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
      setLoading(true);

      try {
        const requestBody = { query: input };

        const response = await fetch("http://13.61.26.215/query", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          const botResponse = data.response.trim();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: botResponse },
          ]);

          onResponse(botResponse);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: 'Sorry, I did not understand your question.' },
          ]);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'There was an error processing your question.' },
        ]);
      }

      setLoading(false);
      setInput('');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Preset questions with answers
  const presetQuestions = [
    {
      question: "What Equipment do you have?",
      answer: "We have a variety of aesthetic lasers and medical equipment available for sale. Here are some examples: \n\n" +
      "**Lumenis AcuPulse SurgiTouch Scanner Surgical Dental Orthopedic Laser** - Priced at $22,000.00\n\n" +
        "**Lumenis AcuPulse SurgiTouch Scanner Surgical Dental Orthopedic Laser** - Priced at $22,000.00\n\n" +
        "**2016 Syneron Velashape III Machine** - Priced at $18,000.00\n\n" +
        "**PicoSure 2013 755 System, accessories and includes Array** - Priced at $29,999.00\n\n" +
        "**2010 Sciton Joule 7 PERFECT Cond, BBL-ST2, Pro-Frac, Microlaser peel laser** - Condition: Excellent\n\n" +
        "We also have many other machines fully functional and priced to sell. For more information, feel free to ask!"
    },
    {
      question: "How can I purchase the Machines?",
      answer: "Hello! To purchase the machines, you can contact us directly:\n\n" +
        "**Call Us:** Reach out at **786-357-1224** for assistance with your purchase.\n" +
        "**Shop Online:** Browse our collection on our website.\n\n" +
        "If you have specific machines in mind, feel free to ask!"
    }
  ];

  const renderTextWithBoldAndNewlines = (text) => {
    // Split the text while preserving bold markers and newlines
    const parts = text.split(/(\*\*[^*]+\*\*|\n)/g).map((part, index) => {
      // Check for bold text
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>; // Render bold text
      } else if (part === "\n") {
        return <br key={index} />; // Render line break
      } else {
        return part; // Regular text
      }
    });
  
    // Return the processed parts wrapped in a <span> for proper spacing
    return <span style={{ whiteSpace: 'pre-wrap' }}>{parts}</span>;
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lowcostlaser Support</h2>
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div key={index} style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
            {message.sender === 'bot' && <span style={styles.icon}>💬</span>}
            {renderTextWithBoldAndNewlines(message.text)}
          </div>
        ))}
      </div>
      {loading && <div style={styles.loading}>Bot is processing...</div>}
      <div style={styles.presetQuestions}>
        {presetQuestions.map((item, index) => (
          <div
            key={index}
            style={styles.presetQuestion}
            onClick={() => setMessages((prev) => [
              ...prev,
              { sender: 'user', text: item.question },
              { sender: 'bot', text: item.answer }
            ])}
          >
            {item.question}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button style={styles.sendButton} onClick={handleSendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
};

// Updated styles for a much larger chatbot container
const styles = {
  container: {
    position: 'fixed',
    bottom: '1.5in', // Raised by 1.5 inches
    left: '10px',
    width: '600px', // Significantly wider
    height: '800px', // Significantly taller
    backgroundColor: '#f9f9f9', // Light background
    color: '#333', // Darker text
    borderRadius: '15px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    fontSize: '1.5rem', // Increased font size
  },
  title: {
    fontSize: '2.5rem', // Larger title font
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: '15px',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
  },
  userMessage: {
    alignSelf: 'flex-start', // Align user messages to the left
    backgroundColor: '#007bff', // Navy blue background for user messages
    color: 'white', // White text for user messages
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '8px',
    maxWidth: '70%',
    marginLeft: '10px', // Indentation for user messages
    fontSize: '1.5rem', // Increased font size for user messages
  },
  botMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '8px',
    maxWidth: '70%',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.5rem', // Increased font size for bot messages
  },
  icon: {
    marginRight: '8px',
  },
  loading: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: '1.2rem',
  },
  presetQuestions: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
    padding: '10px',
  },
  presetQuestion: {
    backgroundColor: '#e0f7fa',
    padding: '8px',
    borderRadius: '10px',
    marginBottom: '5px',
    cursor: 'pointer',
    color: '#00796b',
    fontWeight: 'bold',
    maxWidth: 'fit-content',
    border: '1px solid #00796b',
    fontSize: '1.2rem', // Font size for preset questions
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    backgroundColor: '#fafafa',
    borderRadius: '10px',
  },
  input: {
    flex: 1,
    border: '1px solid #ddd',
    outline: 'none',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#333',
    marginRight: '10px',
    fontSize: '1.5rem', // Increased font size for input
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '1.5rem', // Increased font size for button
  },
};

export default Chatbot;
