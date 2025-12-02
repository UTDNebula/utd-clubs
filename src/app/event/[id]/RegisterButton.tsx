'use client';

import { useMutation } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useTRPC } from '@src/trpc/react';

type RegisterButtonProps = {
  eventId: string;
  isRegistered?: boolean;
};

const RegisterButton: FC<RegisterButtonProps> = ({ eventId, isRegistered }) => {
  const [registered, setRegistered] = useState(isRegistered == true);

  const api = useTRPC();
  const joinMutation = useMutation(api.event.joinEvent.mutationOptions());
  const leaveMutation = useMutation(api.event.leaveEvent.mutationOptions());

  const onClick = () => {
    // If user is already registered, they should be unregistered from event
    if (registered) {
      void leaveMutation.mutateAsync({ id: eventId }).then(() => {
        setRegistered(!registered);
      });
    } else {
      void joinMutation.mutateAsync({ id: eventId }).then(() => {
        setRegistered(!registered);
      });
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={leaveMutation.isPending || joinMutation.isPending}
      className="bg-royal mr-8 rounded-full px-8 py-4 text-xs font-extrabold text-white transition-colors hover:bg-blue-700"
    >
      {registered ? 'Registered' : 'Register'}
    </button>
  );
};

export default RegisterButton;
