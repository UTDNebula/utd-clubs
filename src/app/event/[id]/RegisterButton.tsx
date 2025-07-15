'use client';
import { type FC, useState } from 'react';
import { api } from '@src/trpc/react';

type RegisterButtonProps = {
  eventId: string;
  isRegistered?: boolean;
};

const RegisterButton: FC<RegisterButtonProps> = ({ eventId, isRegistered }) => {
  const [registered, setRegistered] = useState(isRegistered == true);

  const joinMutation = api.event.joinEvent.useMutation();
  const leaveMutation = api.event.leaveEvent.useMutation();

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
      className="bg-blue-primary mr-8 rounded-full px-8 py-4 text-xs font-extrabold text-white transition-colors hover:bg-blue-700"
    >
      {registered ? 'Registered' : 'Register'}
    </button>
  );
};

export default RegisterButton;
