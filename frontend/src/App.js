import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";       // 🏠 Landing page
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";       // 🌍 Explore page
import Spin from "./pages/Spin";
import Quest from "./pages/Quest";
import Achievements from "./pages/Achievements"; // 🏆 Achievements page

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:tripId" element={<Journal />} />

          {/* Explore */}
          <Route path="/explore" element={<Explore />} />

          {/* Achievements */}
          <Route path="/achievements" element={<Achievements />} />

          {/* Quests */}
          <Route path="/quests" element={<Quest />} />

          {/* Spin wheel */}
          <Route path="/spin" element={<Spin />} />

          {/* Fallback */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
