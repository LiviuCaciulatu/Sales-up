import React, { useEffect, useRef, useState } from 'react';

type TimerProps = {
  isActive: boolean;
  onStop?: (elapsed: number) => void;
  resetKey?: any;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Timer: React.FC<TimerProps> = ({ isActive, onStop, resetKey }) => {
  const [remaining, setRemaining] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    setRemaining(300);
  }, [resetKey]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            if (onStop) onStop(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      wasActive.current = true;
    } else if (wasActive.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (onStop) onStop(remaining);
      wasActive.current = false;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, resetKey]);

  return (
  <div
    style={{
      fontWeight: 600,
      fontSize: '1.2em',
      margin: '8px 0',
      textAlign: 'center'
    }}
    data-timer-remaining={remaining}
  >
    {formatTime(remaining)}
  </div>
);
};

export default Timer;
