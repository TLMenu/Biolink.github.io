"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({
  profileId,
  isOwner,
}: {
  profileId: string;
  isOwner: boolean;
}) {
  const trackedRef = useRef(false);

  useEffect(() => {
    // Skip if viewer is the profile owner or already recorded this session
    if (isOwner || trackedRef.current) return;
    trackedRef.current = true;

    // Small delay to ensure legitimate browser render
    const timer = setTimeout(() => {
      fetch("/api/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      }).catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [profileId, isOwner]);

  return null;
}
