import React from "react";

interface CalendarProps {
  date: Date;
  onChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ date, onChange }) => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // formats date as YYYY-MM-DD
  };

  return (
    <input
      type="date"
      value={formatDate(date)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(new Date(e.target.value))
      }
      className="w-[200px] px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 ease-in-out hover:bg-white/20 hover:border-white/40"
    />
  );
};

export default Calendar;
