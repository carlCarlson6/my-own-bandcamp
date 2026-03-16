"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ErrorAlertContextValue = {
  showError: (message: string) => void;
};

const ErrorAlertContext = createContext<ErrorAlertContextValue | null>(null);

export const useErrorAlert = () => {
  const context = useContext(ErrorAlertContext);
  if (!context) {
    throw new Error("useErrorAlert must be used within an ErrorAlertProvider");
  }
  return context;
};

export const ErrorAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const dismiss = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!error) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (dialogRef.current) {
      dialogRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }

      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableSelectors =
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelectors),
      ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (!current || !dialog.contains(current)) {
        e.preventDefault();
        firstElement.focus();
        return;
      }

      if (!e.shiftKey && current === lastElement) {
        e.preventDefault();
        firstElement.focus();
      } else if (e.shiftKey && current === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const previous = previouslyFocusedElementRef.current;
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
      previouslyFocusedElementRef.current = null;
    };
  }, [error, dismiss]);

  return (
    <ErrorAlertContext.Provider value={{ showError }}>
      {children}
      {error && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-alert-title"
          aria-describedby="error-alert-description"
        >
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 id="error-alert-title" className="mb-2 text-lg font-semibold text-red-600">Error</h2>
            <p id="error-alert-description" className="text-gray-700">
              {error}
            </p>
            <button
              ref={closeButtonRef}
              onClick={dismiss}
              className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </ErrorAlertContext.Provider>
  );
};
