import React from "react";

const TypingDots = ({ text = "Please wait for CalvinAI...", style }) => {
  return (
    <div className="typing" style={style}>
      <div className="typing__progress">
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
      </div>
      {text && <p className="typing__text">{text}</p>}
    </div>
  );
};

export default TypingDots;
