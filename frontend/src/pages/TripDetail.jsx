import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./tripdetail.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalPhoto, setJournalPhoto] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPhoto, setEditPhoto] = useState("");

  const [checkInNote, setCheckInNote] = useState("");
  const [lightbox, setLightbox] = useState("");

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`);
      setTrip(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const handlePhotoUpload = (e, setPhotoFn) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoFn(reader.result);
    reader.readAsDataURL(file);
  };

  const handleJournalSubmit = async () => {
    if (!journalContent.trim()) return alert("Content cannot be empty");

    try {
      await axios.post(`http://localhost:5000/api/trips/${tripId}/journal`, {
        title: journalTitle,
        content: journalContent.trim(),
        photo: journalPhoto,
      });
      setJournalTitle("");
      setJournalContent("");
      setJournalPhoto("");
      fetchTrip();
    } catch (err) {
      console.error(err);
      alert("Error adding journal");
    }
  };

  const handleJournalEdit = async (id) => {
    if (!editContent.trim()) return alert("Content cannot be empty");

    try {
      await axios.put(`http://localhost:5000/api/trips/${tripId}/journal/${id}`, {
        title: editTitle,
        content: editContent.trim(),
        photo: editPhoto,
      });
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      setEditPhoto("");
      fetchTrip();
    } catch (err) {
      console.error(err);
      alert("Error editing journal");
    }
  };

  const handleJournalDelete = async (id) => {
    if (!window.confirm("Delete this journal?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/trips/${tripId}/journal/${id}`);
      fetchTrip();
    } catch (err) {
      console.error(err);
      alert("Error deleting journal");
    }
  };

  const handleCheckIn = async () => {
    if (!checkInNote.trim()) return alert("Check-in note cannot be empty");
    try {
      await axios.post(`http://localhost:5000/api/trips/${tripId}/checkin`, { note: checkInNote.trim() });
      setCheckInNote("");
      fetchTrip();
      alert("Checked in ✅");
    } catch (err) {
      console.error(err);
      alert("Error adding check-in");
    }
  };

  if (!trip) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const lat = trip.coordinates?.lat || 28.6139;
  const lng = trip.coordinates?.lng || 77.209;

  return (
    <div className="tripdetail-container">
      <button className="back-button" onClick={() => navigate("/trips")}>
        ← Back
      </button>

      <h2>{trip.title}</h2>
      <p>📍 {trip.location}</p>
      {trip.notes && <p>📝 {trip.notes}</p>}

      <MapContainer center={[lat, lng]} zoom={13} className="leaflet-container">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{trip.location}</Popup>
        </Marker>
      </MapContainer>

      {/* Check-Ins */}
      <h3>Check-Ins</h3>
      <input
        placeholder="Add a note"
        value={checkInNote}
        onChange={(e) => setCheckInNote(e.target.value)}
      />
      <button onClick={handleCheckIn}>Check In ✅</button>
      <ul>
        {trip.checkIns.map((c) => (
          <li key={c._id || c.date}>
            🕒 {new Date(c.date).toLocaleString()} — {c.note || "(No note)"}
          </li>
        ))}
      </ul>

      {/* Journals */}
      <h3>Journal Entries</h3>

      {/* New Journal */}
      <div className="journal-box">
        <input
          type="text"
          placeholder="Title (optional)"
          value={journalTitle}
          onChange={(e) => setJournalTitle(e.target.value)}
        />
        <textarea
          placeholder="Write something..."
          value={journalContent}
          onChange={(e) => setJournalContent(e.target.value)}
        />
        {journalPhoto && (
          <div>
            <img
              src={journalPhoto}
              alt="Preview"
              className="journal-preview"
              onClick={() => setLightbox(journalPhoto)}
            />
            <button className="remove-image-btn" onClick={() => setJournalPhoto("")}>
              Remove Image
            </button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, setJournalPhoto)} />
        <button onClick={handleJournalSubmit}>Save Journal</button>
      </div>

      {/* Existing Journals */}
      {trip.journals.map((j) => (
        <div className="journal-entry" key={j._id}>
          {editingId === j._id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title (optional)"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              {editPhoto && (
                <div>
                  <img
                    src={editPhoto}
                    alt="Preview"
                    className="journal-preview"
                    onClick={() => setLightbox(editPhoto)}
                  />
                  <button className="remove-image-btn" onClick={() => setEditPhoto("")}>
                    Remove Image
                  </button>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, setEditPhoto)} />
              <div className="journal-buttons">
                <button onClick={() => handleJournalEdit(j._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h4>{j.title || "(No Title)"}</h4>
              <p>🕒 {new Date(j.date).toLocaleString()} — {j.content || "(No content)"}</p>
              {j.photo && (
                <img
                  src={j.photo}
                  alt="Journal"
                  className="journal-photo"
                  onClick={() => setLightbox(j.photo)}
                />
              )}
              <div className="journal-buttons">
                <button
                  onClick={() => {
                    setEditingId(j._id);
                    setEditTitle(j.title);
                    setEditContent(j.content);
                    setEditPhoto(j.photo);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleJournalDelete(j._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox("")}>
          <img src={lightbox} alt="Lightbox" />
        </div>
      )}
    </div>
  );
} 