import { createContext } from 'react';

type ParticipantListContextType = {
  openConfirmDialog: (open: boolean) => void;
};

export const ParticipantListContext = createContext<ParticipantListContextType>(
  {
    openConfirmDialog: () => {},
  },
);
