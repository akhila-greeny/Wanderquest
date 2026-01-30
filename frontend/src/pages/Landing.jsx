import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate("/register");
  };

  const handleExplore = () => {
    navigate("/explore");
  };

  return (
    <>
      <header>
        <div className="header-left">
          <img src="/images/logo.jpeg" alt="WanderQuest Logo" className="logo" />
        </div>
        <div className="header-right">
          <a href="/login" className="header-link">Login</a>
        </div>
      </header>

      {/* FULL SCREEN WELCOME */}
      <div
        className="landing-container"
        style={{ backgroundImage: "url('/images/landing.jpeg')" }}
      >
        <h1>Welcome to WanderQuest!</h1>
        <p>Start your journey with us and explore the world like never before!</p>
        <div className="buttons">
          <button className="button-primary" onClick={handleStartJourney}>
            Start Your Journey
          </button>
          <button className="button-primary" onClick={handleExplore}>
            Explore
          </button>
        </div>
        <button
          className="scroll-down"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          Scroll Down ↓
        </button>
      </div>

      {/* INFO SECTION */}
      <section className="info-section">
        <h2>Earn XPs and Conquer the Leaderboard!</h2>
        <p>
          Travel the world, unlock new places, complete fun challenges, and earn
          XPs to climb to the top of our global leaderboard! Track your progress,
          compete with friends, and become the ultimate travel adventurer.
        </p>
      </section>
    </>
  );
}