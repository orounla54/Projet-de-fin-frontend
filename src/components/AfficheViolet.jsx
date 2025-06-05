import React from "react";

function AfficheViolet() {
  return (
    <div className="relative bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04] rounded-lg p-5">
      <div className="absolute bottom-0 -mb-3">
        <svg
          width="44"
          height="42"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ill-b">
              <stop stopColor="#B7ACFF" offset="0%" />
              <stop stopColor="#9C8CFF" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="ill-c">
              <stop stopColor="#4634B1" offset="0%" />
              <stop stopColor="#4634B1" stopOpacity="0" offset="100%" />
            </linearGradient>
            <path id="ill-a" d="m20 0 20 40-20-6.25L0 40z" />
          </defs>
          <g
            transform="scale(-1 1) rotate(-51 -11.267 67.017)"
            fill="none"
            fillRule="evenodd"
          >
            <mask id="ill-d" fill="#fff">
              <use xlinkHref="#ill-a" />
            </mask>
            <use fill="url(#ill-b)" xlinkHref="#ill-a" />
            <path
              fill="url(#ill-c)"
              mask="url(#ill-d)"
              d="M20.586-7.913h25v47.5h-25z"
            />
          </g>
        </svg>
      </div>
      <div className="relative">
        <div className="text-sm font-medium text-gray-800 dark:text-violet-200 mb-2">
          Remember to keep track of your job research.
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-violet-500 hover:text-violet-600">
            .
          </span>
        </div>
      </div>
    </div>
  );
}

export default AfficheViolet;
