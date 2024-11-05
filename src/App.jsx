

// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience";
// import { Chatbot } from "./components/chatbot"; // Import your Chatbot component
// import React, { useState } from 'react';

// function App() {
//   let [playAudio, setPlayAudio] = useState(false); // State to control avatar audio
//   let [script, setScript] = useState('welcome');


//   const handleChatbotResponse = (response) => {
//     if (response) {
//       setScript(response); // Set the script based on the chatbot response
//       setPlayAudio(true);  // Trigger play audio
//       //alert(response)
//     }
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100vh" }}>
//       {/* 3D Scene */}
//       <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
//         <color attach="background" args={["#ececec"]} />
//         <Experience playAudio={playAudio } script={script} />
//       </Canvas>

//       {/* Chatbot component */}
//       <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1 }}>
//         <Chatbot onResponse={handleChatbotResponse} /> {/* Pass onResponse instead */}
//       </div>
//     </div>
//   );
// }

// export default App;

import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Chatbot } from "./components/chatbot"; // Import your Chatbot component
import React, { useState } from 'react';
import chatIcon from './assets/chat-icon.png'; // Import your chat icon image (adjust the path)

function App() {
  const [showChatbotAndExperience, setShowChatbotAndExperience] = useState(false); // Track visibility
  const [playAudio, setPlayAudio] = useState(false); // State to control avatar audio
  const [script, setScript] = useState('welcome');

  const handleChatbotResponse = (response) => {
    if (response) {
      setScript(response); // Set the script based on the chatbot response
      setPlayAudio(true);  // Trigger play audio
    }
  };

  const toggleVisibility = () => {
    setShowChatbotAndExperience((prevState) => !prevState); // Toggle visibility
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Round Button with Chat Icon */}
      <button
        onClick={toggleVisibility}
        style={{
          position: "absolute",
          bottom: "20px", // Position at bottom of the page
          left: "20px",   // Align to the left
          width: "80px",  // Increased width
          height: "80px", // Increased height
          borderRadius: "50%",
          backgroundColor: "#003366", // Dark Blue color
          color: "#fff",
          border: "none",
          zIndex: 2,
          fontSize: "28px", // Increased font size for "X"
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {showChatbotAndExperience ? (
          "X"  // When the chatbot and experience are shown, show an "X" to close
        ) : (
          <img src={chatIcon} alt="Chat Icon" style={{ width: '40px', height: '40px' }} />  // Larger chat icon when closed
        )}
      </button>

      {/* Conditionally render Chatbot and Experience */}
      {showChatbotAndExperience && (
        <>
          {/* 3D Scene */}
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience playAudio={playAudio} script={script} />
          </Canvas>

          {/* Chatbot component */}
          <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1 }}>
            <Chatbot onResponse={handleChatbotResponse} /> {/* Pass onResponse */}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
