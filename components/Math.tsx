import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    MathJax?: any;
  }
}

export const Math: React.FC<{ children: string }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // MathJax is loaded globally in your layout
    if (window.MathJax && ref.current) {
      window.MathJax.typesetPromise([ref.current]);
    }
  }, [children]);

  return (
    <div ref={ref} className="math-solution">
      {children}
    </div>
  );
};
