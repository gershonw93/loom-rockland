/**
 * Simple LOOM wordmark — the two "O"s carry the signature dots, echoing the
 * LOOM Social Care Network logo.
 */
export function LoomMark({ size = 30 }: { size?: number }) {
  return (
    <span className="brand" aria-label="LOOM Social Care Network">
      <svg
        width={size * 3.4}
        height={size}
        viewBox="0 0 170 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <text
          x="0"
          y="40"
          fontFamily="-apple-system, Segoe UI, Roboto, Arial, sans-serif"
          fontSize="44"
          fontWeight="800"
          letterSpacing="2"
          fill="#5b4bd6"
        >
          L
        </text>
        {/* two O's with dots */}
        <circle cx="60" cy="30" r="15" stroke="#5b4bd6" strokeWidth="7" />
        <circle cx="60" cy="11" r="3.4" fill="#5b4bd6" />
        <circle cx="100" cy="30" r="15" stroke="#5b4bd6" strokeWidth="7" />
        <circle cx="100" cy="11" r="3.4" fill="#5b4bd6" />
        <text
          x="118"
          y="40"
          fontFamily="-apple-system, Segoe UI, Roboto, Arial, sans-serif"
          fontSize="44"
          fontWeight="800"
          letterSpacing="2"
          fill="#5b4bd6"
        >
          M
        </text>
      </svg>
      <span className="tagline">Social Care Network</span>
    </span>
  );
}
