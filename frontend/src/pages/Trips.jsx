import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./trips.css";

export default function Trips() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [trips, setTrips] = useState([]);

  const validatePlace = async (place) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      return res.data && res.data.length > 0;
    } catch (err) {
      console.error("Error validating place:", err);
      return false;
    }
  };

  const addTrip = async (e) => {
    e.preventDefault();

    if (!title || !location) {
      alert("Please fill all required fields.");
      return;
    }

    const isValid = await validatePlace(location);
    if (!isValid) {
      alert("❌ Invalid place name. Try a real location (e.g., Delhi, Paris).");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/trips/addTrip", {
        userId,
        title,
        location,
        notes,
      });

      const trip = response.data.trip;
      alert("✅ Trip added successfully!");
      setTitle("");
      setLocation("");
      setNotes("");
      setTrips((prev) => [...prev, trip]);

      navigate(`/trip/${trip._id}`);
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Error adding trip ❌");
    }
  };

  const loadTrips = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/trips/myTrips/${userId}`);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip? 🗑️")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trips/${tripId}`);
      setTrips(trips.filter((t) => t._id !== tripId));
      alert("Trip deleted successfully ✅");
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Error deleting trip ❌");
    }
  };

  useEffect(() => {
    if (userId) loadTrips();
  }, [userId]);

  return (
    <div className="trips-container">
      <h2>Your Trips ✈️</h2>

      <form className="trip-form" onSubmit={addTrip}>
        <input
          placeholder="Trip Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button>Add Trip</button>
      </form>

      <div className="trip-list">
        {trips.length === 0 ? (
          <p>No trips yet. Start your adventure! 🌍</p>
        ) : (
          trips.map((t) => (
            <div className="trip-card" key={t._id}>
              <div className="trip-content" onClick={() => navigate(`/trip/${t._id}`)}>
                <h3>{t.title}</h3>
                <p>📍 {t.location}</p>
                {t.notes && <p className="notes">📝 {t.notes}</p>}
              </div>

              <button className="delete-btn" onClick={() => deleteTrip(t._id)}>
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
