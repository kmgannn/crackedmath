import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: any[]) => Promise<any>;
    };
  }
}

export const Math: React.FC<{ children: string }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const unescaped = children.replace(/\\\\/g, "\\");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let interval: NodeJS.Timeout | null = null;

    const tryTypeset = () => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise([el]).catch((err) => {
          console.error("MathJax typeset failed:", err);
        });
        if (interval) clearInterval(interval);
      } else {
        console.warn("MathJax not ready yet. Retrying...");
      }
    };

    tryTypeset(); // Initial try

    // If MathJax isn't ready yet, retry every 100ms until it is
    interval = setInterval(tryTypeset, 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [unescaped]);

  return (
    <div
      ref={ref}
      className="math-solution"
      dangerouslySetInnerHTML={{ __html: unescaped }}
    />
  );
};
