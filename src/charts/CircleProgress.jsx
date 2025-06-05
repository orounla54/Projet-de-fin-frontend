import React from "react";

function CircleProgress({ value, width, height }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      {/* Cercle de fond */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        className="stroke-gray-200 dark:stroke-gray-700"
        strokeWidth="13"
      />

      {/* Cercle de progression */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        className="stroke-green-500 dark:stroke-green-400"
        strokeWidth="13"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />

      {/* Texte au centre */}
      <text
        x="50"
        y="55"
        textAnchor="middle"
        className="fill-gray-900 dark:fill-white font-bold text-lg"
      >
        {value}%
      </text>
    </svg>
  );
}

export default CircleProgress;
