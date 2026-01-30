import React, { useState } from "react";
import "./explore.css";

export default function Explore() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const exploreData = [
    {
      name: "Cityscapes",
      img: "/images/one.jpeg",
      recommendations: [
        "New York City, USA",
        "Tokyo, Japan",
        "London, UK",
        "Dubai, UAE",
      ],
    },
    {
      name: "Canal Towns",
      img: "/images/two.jpeg",
      recommendations: [
        "Venice, Italy",
        "Amsterdam, Netherlands",
        "Bruges, Belgium",
        "Copenhagen, Denmark",
      ],
    },
    {
      name: "Snowy Mountains",
      img: "/images/three.jpeg",
      recommendations: [
        "Swiss Alps, Switzerland",
        "Manali, India",
        "Banff, Canada",
        "Aspen, USA",
      ],
    },
    {
      name: "Beaches",
      img: "/images/four.jpeg",
      recommendations: [
        "Bali, Indonesia",
        "Phuket, Thailand",
        "Goa, India",
        "Maldives",
      ],
    },
    {
      name: "Waterfalls",
      img: "/images/five.jpeg",
      recommendations: [
        "Niagara Falls, USA/Canada",
        "Jog Falls, India",
        "Iguazu Falls, Brazil",
        "Angel Falls, Venezuela",
      ],
    },
    {
      name: "Historic Places",
      img: "/images/six.jpeg",
      recommendations: [
        "Rome, Italy",
        "Athens, Greece",
        "Kyoto, Japan",
        "Machu Picchu, Peru",
      ],
    },
    {
      name: "Deserts",
      img: "/images/seven.jpeg",
      recommendations: [
        "Sahara Desert, Africa",
        "Thar Desert, India",
        "Wadi Rum, Jordan",
        "Death Valley, USA",
      ],
    },
    {
      name: "Forests",
      img: "/images/eight.jpeg",
      recommendations: [
        "Amazon Rainforest, Brazil",
        "Sundarbans, India",
        "Black Forest, Germany",
        "Daintree, Australia",
      ],
    },
  ];

  return (
    <div className="explore-page">
      <h2>🌍 Explore Destinations</h2>

      <div className="explore-grid">
        {exploreData.map((place, index) => (
          <div
            key={index}
            className="explore-card"
            onClick={() => setSelectedPlace(place)}
          >
            <img src={place.img} alt={place.name} />
            <div className="overlay">
              <h3>{place.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedPlace && (
        <div
          className="popup-overlay fade-in"
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className="popup-box zoom-in"
            onClick={(e) => e.stopPropagation()} // prevents close on inside click
          >
            <h2>{selectedPlace.name} Recommendations</h2>
            <ul>
              {selectedPlace.recommendations.map((rec, i) => (
                <li key={i}>📍 {rec}</li>
              ))}
            </ul>
            <button onClick={() => setSelectedPlace(null)}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
