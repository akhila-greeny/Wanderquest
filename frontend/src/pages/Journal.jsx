import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./journal.css";

export default function Journal() {
  const { tripId } = useParams();
  const userId = sessionStorage.getItem("userId");

  const [entries, setEntries] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(tripId || "");

  // ✅ Fetch user's trips
  const fetchTrips = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/myTrips/${userId}`);
      setTrips(res.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  // ✅ Fetch journals for selected trip
  const fetchEntries = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/trips/${id}`);
      setEntries(res.data.journals || []);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    if (selectedTripId) fetchEntries(selectedTripId);
  }, [selectedTripId]);

  return (
    <div className="journal-container">
      <h2>📖 Your Travel Journals</h2>

      {/* ✅ Show trip selection */}
      {!selectedTripId && (
        <div className="trip-buttons">
          <h3>Select a Trip to View Journals</h3>
          <div className="trip-list">
            {trips.length === 0 ? (
              <p>No trips found. Add a trip first from the Trips page ✈️</p>
            ) : (
              trips.map((trip) => (
                <button
                  key={trip._id}
                  onClick={() => setSelectedTripId(trip._id)}
                  className="trip-btn"
                >
                  {trip.title} 📍
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ✅ Show journals for selected trip */}
      {selectedTripId && (
        <>
          <button
            className="back-btn"
            onClick={() => {
              setSelectedTripId("");
              setEntries([]);
            }}
          >
            ← Back to All Trips
          </button>

          <h3>Journal Entries</h3>
          <hr />

          {loading ? (
            <p>Loading journals...</p>
          ) : entries.length === 0 ? (
            <p>No journal entries yet for this trip 🌍</p>
          ) : (
            <div className="entries">
              {entries.map((j) => (
                <div key={j._id} className="entry-card">
                  <h3>{j.title || "(Untitled Entry)"}</h3>
                  <p>{j.content}</p>
                  <small>🕒 {new Date(j.date).toLocaleString()}</small>
                  {j.photo && (
                    <img
                      src={j.photo}
                      alt="Journal"
                      className="journal-photo"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}