"use client"

import { RefObject, useEffect, useState } from "react";

export function useIntersection(
  element: RefObject<HTMLElement | null>,
  rootMargin: string = "0px"
): boolean {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => observer.unobserve(el);
  }, [element, rootMargin]);

  return isVisible;
}
