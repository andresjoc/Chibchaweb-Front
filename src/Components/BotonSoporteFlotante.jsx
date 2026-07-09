import React from "react";
import { BiSupport } from "react-icons/bi";

export default function BotonSoporteFlotante() {
  const toggleChat = () => {
    if (window.chatbase) {
      const chatWindow = document.getElementById("chatbase-bubble-window");
      
      // Check if chat window is currently visible/rendered
      if (
        chatWindow && 
        chatWindow.style.visibility !== "hidden" && 
        chatWindow.style.display !== "none" && 
        chatWindow.offsetHeight > 0
      ) {
        window.chatbase("close");
      } else {
        window.chatbase("open");
      }
    } else {
      console.warn("Chatbase is not initialized yet.");
    }
  };

  return (
    <button 
      className="custom-support-float" 
      onClick={toggleChat} 
      title="Atención y Soporte"
      aria-label="Atención y Soporte"
    >
      <BiSupport size={28} />
    </button>
  );
}
