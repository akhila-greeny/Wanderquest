import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./quest.css";

export default function Quest() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [completedQuests, setCompletedQuests] = useState({});

  // ⭐ Updated quest list with icons
  const questList = [
    "🏛️ Explore a museum",
    "🛍️ Buy a souvenir",
    "📝 Write a journal entry",
    "🌇 Watch the sunset",
    "📸 Take photos",
    "💬 Talk to a local",
    "🗺️ Visit a hidden gem",
    "🍲 Try local food",
    "📍 Learn a fun fact about the place",
    "🤝 Help a fellow traveler or local",
  ];

  // Load user trips + completed quests from backend
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/trips/myTrips/${userId}`
        );
        setTrips(res.data);

        const saved = {};
        res.data.forEach((trip) => {
          if (trip.quests) {
            Object.entries(trip.quests).forEach(([questName, done]) => {
              if (done) saved[`${trip._id}-${questName}`] = true;
            });
          }
        });
        setCompletedQuests(saved);
      } catch (err) {
        console.error("❌ Error loading trips:", err);
      }
    };

    if (userId) fetchTrips();
  }, [userId]);

  // Update quest completion + XP
  const handleQuestToggle = async (tripId, questName, isChecked) => {
    const questKey = `${tripId}-${questName}`;
    if (completedQuests[questKey] && isChecked) return;

    if (isChecked) {
      try {
        const res = await axios.put(
          `http://localhost:5000/api/trips/${tripId}/quest`,
          { questName }
        );

        setCompletedQuests((prev) => ({ ...prev, [questKey]: true }));

        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip._id === tripId ? res.data.trip : trip
          )
        );

        alert(`✅ Quest completed! +100 XP`);
      } catch (error) {
        console.error("❌ Error updating quest:", error);
        alert("Error saving quest progress ❌");
      }
    }
  };

  const openPopup = (trip) => {
    setSelectedTrip(trip);
    setShowPopup(true);
  };

  if (!userId) {
    return (
      <div className="quest-page">
        <h2 className="quest-title">Please log in to view quests</h2>
      </div>
    );
  }

  return (
    <div className="quest-page">

      {/* 🔙 Back to dashboard */}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ⬅ Back
      </button>

      {/* 🎡 Go to Spin Wheel */}
      <button className="spin-btn" onClick={() => navigate("/spin")}>
        🎡 Spin Wheel
      </button>

      <h2 className="quest-title">Your Quests 🗺️</h2>

      <div className="trip-list">
        {trips.length === 0 ? (
          <p>No trips found. Start exploring! 🌍</p>
        ) : (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="trip-box"
              onClick={() => openPopup(trip)}
            >
              <h3>{trip.title}</h3>
              <span className="xp-badge-main">{trip.xp || 0} XP</span>
            </div>
          ))
        )}
      </div>

      {showPopup && selectedTrip && (
        <div className="popup" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">
              {selectedTrip.title} — Quests ✨
            </h3>

            <ul className="quest-list">
              {questList.map((quest) => {
                const questKey = `${selectedTrip._id}-${quest}`;
                const isCompleted = completedQuests[questKey];

                return (
                  <li key={quest} className="quest-item">
                    <label className="quest-label">
                      <input
                        type="checkbox"
                        checked={isCompleted || false}
                        onChange={(e) =>
                          handleQuestToggle(
                            selectedTrip._id,
                            quest,
                            e.target.checked
                          )
                        }
                        disabled={isCompleted}
                        className="quest-checkbox"
                      />
                      <span
                        className={
                          isCompleted ? "quest-text completed" : "quest-text"
                        }
                      >
                        {quest}
                      </span>
                    </label>
                    {isCompleted && (
                      <span className="xp-badge">+100 XP</span>
                    )}
                  </li>
                );
              })}
            </ul>

            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}