export const Loader = ({ size = 38 }: { size?: number }) => {
  return (
    <div className="relative animate-spin">
      <svg
        width={size}
        height={size}
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="#D9D9D9"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeDasharray="100"
          strokeDashoffset="70"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
