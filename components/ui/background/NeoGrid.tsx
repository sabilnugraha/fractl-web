export default function NeoGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#f3f7ff" }}
      />

      {/* SVG grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="fractl-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#2EE0D1"
              strokeWidth="2"
            />
          </pattern>

          <pattern
            id="fractl-grid-shadow"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2"
            />
          </pattern>

          <radialGradient id="fractl-glow" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="rgba(46,224,209,0.14)" />
            <stop offset="55%" stopColor="rgba(46,224,209,0.06)" />
            <stop offset="100%" stopColor="rgba(46,224,209,0)" />
          </radialGradient>
        </defs>

        {/* Shadow offset */}
        <rect
          x="6"
          y="6"
          width="100%"
          height="100%"
          fill="url(#fractl-grid-shadow)"
          opacity="0.22"
        />

        {/* Main grid */}
        <rect
          width="100%"
          height="100%"
          fill="url(#fractl-grid)"
          opacity="0.9"
        />

        {/* Glow */}
        <rect
          width="100%"
          height="100%"
          fill="url(#fractl-glow)"
        />
      </svg>
    </div>
  );
}
