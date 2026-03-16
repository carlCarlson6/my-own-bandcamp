"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ErrorAlertContextValue = {
  showError: (message: string) => void;
};

const ErrorAlertContext = createContext<ErrorAlertContextValue>({
  showError: () => undefined,
});

export const useErrorAlert = () => useContext(ErrorAlertContext);

export const ErrorAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const dismiss = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!error) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [error, dismiss]);

  return (
    <ErrorAlertContext.Provider value={{ showError }}>
      {children}
      {error && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-alert-title"
        >
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 id="error-alert-title" className="mb-2 text-lg font-semibold text-red-600">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button
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
