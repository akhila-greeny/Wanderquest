import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./spin.css";

export default function WanderWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [rotation, setRotation] = useState(0);
  const navigate = useNavigate();

  const quests = [
    { text: "Try local food", emoji: "🍜" },
    { text: "Visit a hidden gem", emoji: "🏞️" },
    { text: "Talk to a local", emoji: "👋" },
    { text: "Take 5 photos", emoji: "📸" },
    { text: "Watch the sunset", emoji: "🌅" },
    { text: "Write a journal entry", emoji: "📝" },
    { text: "Explore a museum", emoji: "🏛️" },
    { text: "Buy a souvenir", emoji: "🎁" },
    { text: "Learn a fun fact", emoji: "📍" },
    { text: "Help a traveler", emoji: "🤝" },
  ];

  const colors = [
    "#ffb300",
    "#4caf50",
    "#f44336",
    "#2196f3",
    "#9c27b0",
    "#ff9800",
    "#3f51b5",
    "#009688",
    "#e91e63",
    "#00bcd4"
  ];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult("");

    const randomIndex = Math.floor(Math.random() * quests.length);
    const degreesPerSlice = 360 / quests.length;
    const extraSpins = 3600;
    const offsetToCenter = degreesPerSlice / 2;
    const newRotation = extraSpins + (360 - (randomIndex * degreesPerSlice + offsetToCenter));

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(`${quests[randomIndex].text} ${quests[randomIndex].emoji}`);

      setTimeout(() => {
        setRotation(newRotation % 360);
      }, 50);
    }, 3600);
  };

  return (
    <div className="spin-page">

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="title">🎡 Wander Wheel</h1>
      <p className="subtitle">
        Spin the wheel and get your next travel quest!
      </p>

      <div className="wheel-container">
        <div className="arrow-pointer">▼</div>

        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className={`wheel ${spinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {quests.map((quest, i) => {
            const angle = (360 / quests.length) * i;
            const nextAngle = (360 / quests.length) * (i + 1);
            const startRad = (angle - 90) * (Math.PI / 180);
            const endRad = (nextAngle - 90) * (Math.PI / 180);

            const x1 = 200 + 200 * Math.cos(startRad);
            const y1 = 200 + 200 * Math.sin(startRad);
            const x2 = 200 + 200 * Math.cos(endRad);
            const y2 = 200 + 200 * Math.sin(endRad);

            const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

            return (
              <g key={i}>
                <path
                  d={pathData}
                  fill={colors[i]}
                  stroke="#1a237e"
                  strokeWidth="3"
                />
              </g>
            );
          })}

          {quests.map((quest, i) => {
            const sliceAngle = 360 / quests.length;
            const midAngle = sliceAngle * i + sliceAngle / 2;
            const textAngle = midAngle + 90;
            const rad = (midAngle - 90) * (Math.PI / 180);
            const radius = 130;
            const x = 200 + radius * Math.cos(rad);
            const y = 200 + radius * Math.sin(rad);

            return (
              <g key={`text-${i}`}>
                <text
                  x="0"
                  y="0"
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`translate(${x}, ${y}) rotate(${textAngle})`}
                  className="wheel-text"
                >
                  <tspan x="0" dy="-8">{quest.emoji}</tspan>
                  <tspan x="0" dy="18">{quest.text}</tspan>
                </text>
              </g>
            );
          })}

          <circle
            cx="200"
            cy="200"
            r="30"
            fill="#1a237e"
            stroke="white"
            strokeWidth="4"
          />
        </svg>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="spin-btn"
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>

      {result && (
        <div className="result-box">
          <h3 className="result-title">Your Challenge 🎯</h3>
          <p className="result-text">{result}</p>
        </div>
      )}
    </div>
  );
}
