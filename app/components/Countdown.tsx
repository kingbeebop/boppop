import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

function Countdown() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.now().setZone('America/New_York');
      const nextWednesday = now.plus({ days: (3 - now.weekday) % 7 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      const nextThursday = nextWednesday.plus({ days: 1 });

      let targetTime = nextWednesday;
      if (now >= nextWednesday && now < nextThursday) {
        targetTime = nextThursday;
      } else if (now >= nextThursday) {
        targetTime = nextWednesday.plus({ weeks: 1 });
      }

      const diff = targetTime.diff(now);
      const days = Math.floor(diff.as('days'));
      const hours = Math.floor(diff.as('hours') % 24);
      const minutes = Math.floor(diff.as('minutes') % 60);
      const seconds = Math.floor(diff.as('seconds') % 60);

      setCountdown(
        `${(days < 10 ? '0' : '') + days} : ${(hours < 10 ? '0' : '') + hours} : ${
          (minutes < 10 ? '0' : '') + minutes
        } : ${(seconds < 10 ? '0' : '') + seconds}`
      );

      if (diff.as('seconds') <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return <div className="countdown">{countdown}</div>;
}

export default Countdown;
