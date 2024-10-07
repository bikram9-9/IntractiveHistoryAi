import React, { useState, useEffect, useRef } from "react";

interface HistoryEvent {
  id: number;
  title: string;
  description: string;
  year: number;
}

interface HistoryCardProps {
  event: HistoryEvent;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ event }) => {
  return (
    <div className="flex-shrink-0 w-full sm:w-[calc(100%/3)] p-4">
      <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-md h-full overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {event.year}
        </p>
        <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
};

interface HistoryCardsProps {
  events: HistoryEvent[];
  onClose: () => void;
}

const HistoryCards: React.FC<HistoryCardsProps> = ({ events, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 h-[40vh] bg-black bg-opacity-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-xl font-bold text-white">Historical Events</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 focus:outline-none text-lg"
          >
            Close
          </button>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing scrollbar-hide"
          style={{
            height: "calc(30vh - 40px)",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {events.map((event) => (
            <HistoryCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryCards;
