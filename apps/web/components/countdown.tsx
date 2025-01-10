import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  }>(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
    } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = (
    Object.keys(timeLeft) as (keyof typeof timeLeft)[]
  ).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-xl md:text-2xl font-bold" key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="text-center p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Time until event starts:</h2>
      <div className="flex justify-center space-x-4">
        {timerComponents.length ? (
          timerComponents
        ) : (
          <span className="text-2xl font-bold">Event has started!</span>
        )}
      </div>
    </div>
  );
}
