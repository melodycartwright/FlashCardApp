import { useState, useEffect } from "react";

export default function CardFlip({ card, onFlip, isFlipped, className = "" }) {
  const [localFlipped, setLocalFlipped] = useState(false);

  useEffect(() => {
    setLocalFlipped(isFlipped);
  }, [isFlipped]);

  const handleFlip = () => {
    const newFlipped = !localFlipped;
    setLocalFlipped(newFlipped);
    if (onFlip) {
      onFlip(newFlipped);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleFlip();
    }
  };

  if (!card) {
    return (
      <div
        className={`bg-white rounded-lg shadow-lg p-8 min-h-[300px] flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500">No card to display</div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg min-h-[300px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform duration-200 hover:shadow-xl ${className}`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={
        localFlipped
          ? "Card back side. Press Space or Enter to flip to front"
          : "Card front side. Press Space or Enter to flip to back"
      }
    >
      {/* Flip Indicator */}
      <div className="absolute top-4 right-4 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {localFlipped ? "Back" : "Front"}
      </div>

      {/* Card Content */}
      <div className="p-8 h-full flex flex-col justify-center">
        <div className="text-center">
          <div className="text-lg leading-relaxed">
            {localFlipped ? card.back : card.front}
          </div>
        </div>
      </div>

      {/* Flip Instruction */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
        Press Space or click to flip
      </div>
    </div>
  );
}
