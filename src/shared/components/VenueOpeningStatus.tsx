"use client";

import { useEffect, useState } from "react";
import { venue } from "@/src/config/venue";
import {
  getVenueOpeningStatus,
  type VenueOpeningStatus as OpeningStatus,
} from "@/src/domain/venue/opening-hours";

interface VenueOpeningStatusProps {
  initialStatus: OpeningStatus;
}

const CLOCK_TOLERANCE_IN_MS = 100;
const ONE_MINUTE_IN_MS = 60_000;

function getDelayUntilNextMinute() {
  return (
    ONE_MINUTE_IN_MS - (Date.now() % ONE_MINUTE_IN_MS) + CLOCK_TOLERANCE_IN_MS
  );
}

export function VenueOpeningStatus({
  initialStatus,
}: VenueOpeningStatusProps) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    let timerId: number | undefined;

    const scheduleUpdate = () => {
      window.clearTimeout(timerId);
      setStatus(getVenueOpeningStatus(venue.openingSchedule, new Date()));
      timerId = window.setTimeout(scheduleUpdate, getDelayUntilNextMinute());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleUpdate();
      }
    };

    timerId = window.setTimeout(scheduleUpdate, 0);
    window.addEventListener("focus", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("focus", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-md border border-[#e7a316]/35 bg-[#1a1008] px-3 py-2 text-[#fff0c2]"
      data-venue-status={status.state}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${status.label}. ${status.detail}.`}
    >
      <span
        className={`size-2 shrink-0 rounded-full ${
          status.isOpen
            ? "bg-[#45c96b] shadow-[0_0_0_4px_rgb(69_201_107/0.10),0_0_10px_rgb(69_201_107/0.22)]"
            : "bg-[#a9443e] shadow-[0_0_0_4px_rgb(169_68_62/0.10)]"
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0 leading-tight">
        <span className="block whitespace-nowrap text-[11px] font-bold sm:text-xs">
          {status.label}
        </span>
        <span className="mt-0.5 hidden whitespace-nowrap text-[9px] font-medium text-[#cdb886] sm:block">
          {status.detail}
        </span>
      </span>
    </div>
  );
}
