import React, { useEffect } from "react";
import "./dashboard.css";

export default function Dashboard() {

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!sessionStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
  }, []);

  // Get username from sessionStorage
  const username = sessionStorage.getItem("username") || "Traveler";

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      <div className="dash-container">
        <h2>Welcome, {username} 👋</h2>

        {/* Menu */}
        <div className="menu">
          <a href="/trips">🗺️ Trips</a>
          <a href="/journal">📓 Journal</a>
          <a href="/achievements">🏆 Achievements</a>
          <a href="/spin">🎡 Spin Wheel</a>
          <a href="/quests">🗡️ Quests</a>
        </div>

        {/* Logout button */}
        <button className="logout-btn" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>
    </div>
  );
}
