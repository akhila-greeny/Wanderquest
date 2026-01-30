// src/pages/Achievements.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./achievements.css";

export default function Achievements() {
  const [trips, setTrips] = useState([]);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/trips/myTrips/${userId}`
        );
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, [userId]);

  // ============================
  // GLOBAL BADGES (not trip-based)
  // ============================
  const GLOBAL_BADGES = [
    { name: "Souvenir Collector", key: "souvenir" },
    { name: "Journalist", key: "journal_written" },
    { name: "Sunset Chaser", key: "sunset" },
    { name: "Local Historian", key: "local_history" },
    { name: "Friendly Traveler", key: "friendly" },
    { name: "Explorer Badge", key: "explorer" },
    { name: "Memory Keeper", key: "memory_keeper" },
    { name: "Epic Explorer", key: "epic_explorer" },
    { name: "Foodie", key: "foodie" },
    { name: "Social Butterfly", key: "social_butterfly" },
  ];

  // Combine all trips → track if any quest completed globally
  const questStatus = {};
  trips.forEach((trip) => {
    Object.entries(trip.quests || {}).forEach(([quest, done]) => {
      if (done) questStatus[quest] = true;
    });
  });

  // Build global badges array
  const badges = GLOBAL_BADGES.map((badge) => ({
    name: badge.name,
    unlocked: questStatus[badge.key] === true,
  }));

  return (
    <div className="achievements-page">
      <h2>Your Achievements 🏆</h2>

      <div className="badges-container">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`badge ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon">
              {badge.name.charAt(0)} {/* First letter as icon */}
            </div>
            <div className="badge-details">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-status">
                {badge.unlocked ? "Unlocked ✓" : "Locked 🔒"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
