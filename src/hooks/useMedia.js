// src/hooks/useMedia.js

"use client";

import { useEffect, useState } from "react";

/**
 * Return true when viewport >= breakpoint (px).
 * Robust: runs only on client, supports old addListener/removeListener.
 */
export function useIsDesktop(breakpoint = 1025) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = `(min-width:${breakpoint}px)`;
    const mql = window.matchMedia(query);

    const update = () => setIsDesktop(!!mql.matches);
    update();

    // Safari/old Chromium fallback
    const add = mql.addEventListener?.bind(mql) ?? mql.addListener?.bind(mql);
    const remove = mql.removeEventListener?.bind(mql) ?? mql.removeListener?.bind(mql);

    if (add && remove) {
      add("change", update);
      return () => remove("change", update);
    }
    return undefined;
  }, [breakpoint]);

  return isDesktop;
}
