import { create } from "zustand";

import { type RouterOutputs } from "~/utils/trpc/react";

type ReleaseData = RouterOutputs["bandcamp"]["fetchReleaseData"]["data"];

type ReleaseStoreState = {
  releaseData: ReleaseData | null;
  errorMessage: string | null;
  setReleaseData: (data: ReleaseData | null) => void;
  setErrorMessage: (message: string | null) => void;
};

export const useReleaseStore = create<ReleaseStoreState>((set) => ({
  releaseData: null,
  errorMessage: null,
  setReleaseData: (data) => set({ releaseData: data }),
  setErrorMessage: (message) => set({ errorMessage: message }),
}));
