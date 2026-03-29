'use client';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Skeleton,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useRegisterModal } from '@src/components/global/RegisterModalProvider';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import { useTRPC } from '@src/trpc/react';
import { authClient } from '@src/utils/auth-client';

type JoinButtonProps = {
  isHeader?: boolean;
  clubId: string;
  clubSlug?: string;
};

const JoinButton = ({ isHeader, clubId, clubSlug }: JoinButtonProps) => {
  const { data: session } = authClient.useSession();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: memberState, isPending } = useQuery(
    api.club.memberState.queryOptions({ id: clubId }),
  );
  const { data: membershipPolicy } = useQuery(
    api.club.membershipPolicy.queryOptions({ id: clubId }),
  );

  const memberStateQueryKey = [
    ['club', 'memberState'],
    { input: { id: clubId }, type: 'query' },
  ];

  const invalidateMemberState = () => {
    queryClient.invalidateQueries({ queryKey: memberStateQueryKey });
  };

  const follow = useMutation(
    api.club.follow.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Followed club!',
          type: 'success',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const unfollow = useMutation(
    api.club.unfollow.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Unfollowed club',
          type: 'info',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const join = useMutation(
    api.club.join.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Joined club!',
          type: 'success',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const leave = useMutation(
    api.club.leave.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Left club',
          type: 'info',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const requestJoin = useMutation(
    api.club.requestJoin.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Request sent!',
          type: 'success',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const cancelRequest = useMutation(
    api.club.cancelRequest.mutationOptions({
      onSuccess: () => {
        invalidateMemberState();
        setSnackbar({
          message: 'Request removed',
          type: 'info',
          autoHideDuration: true,
          fitContent: true,
          closeOn: ['timeout', 'escapeKeyDown', 'dismiss'],
        });
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage('An error occurred', error.message),
        );
      },
    }),
  );

  const router = useRouter();
  const useAuthPage = useRef(false);
  const { setShowRegisterModal } = useRegisterModal(() => {
    useAuthPage.current = true;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const memberType = memberState?.memberType ?? null;
  const policy = membershipPolicy ?? 'open';
  const anyPending =
    follow.isPending ||
    unfollow.isPending ||
    join.isPending ||
    leave.isPending ||
    requestJoin.isPending ||
    cancelRequest.isPending;

  const requireAuth = (callback: () => void) => {
    if (!session) {
      if (useAuthPage.current) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        setShowRegisterModal(true);
      }
      return;
    }
    callback();
  };

  const size = isHeader ? 'large' : 'small';

  // Officers/Presidents see the Manage button
  if (memberType === 'Officer' || memberType === 'President') {
    return (
      <Button
        LinkComponent={Link}
        href={`/manage/${clubSlug ?? clubId}`}
        variant="contained"
        size={size}
        className="normal-case"
        startIcon={<TuneIcon />}
      >
        Manage
      </Button>
    );
  }

  // Not connected: show Follow button
  if (!memberType) {
    return (
      <Button
        variant="contained"
        size={size}
        startIcon={<AddIcon />}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (isPending || anyPending) return;
          requireAuth(() => follow.mutate({ clubId }));
        }}
        className="normal-case"
        loading={isPending || follow.isPending}
      >
        Follow
      </Button>
    );
  }

  // Member: show Leave button
  if (memberType === 'Member') {
    return (
      <Button
        variant="contained"
        size={size}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (anyPending) return;
          leave.mutate({ clubId });
        }}
        className="normal-case"
        loading={leave.isPending}
      >
        Leave
      </Button>
    );
  }

  // Requested: show Remove Request button
  if (memberType === 'Requested') {
    return (
      <Button
        variant="contained"
        size={size}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (anyPending) return;
          cancelRequest.mutate({ clubId });
        }}
        className="normal-case"
        loading={cancelRequest.isPending}
      >
        Remove Request
      </Button>
    );
  }

  // Follower: show split button with Join/Request + Unfollow dropdown
  const joinLabel =
    policy === 'open'
      ? 'Join'
      : policy === 'request'
        ? 'Request to Join'
        : null;

  const handleJoinAction = () => {
    if (anyPending) return;
    if (policy === 'open') {
      join.mutate({ clubId });
    } else if (policy === 'request') {
      requestJoin.mutate({ clubId });
    }
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        size={size}
        ref={anchorRef}
        className="normal-case"
      >
        {joinLabel ? (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleJoinAction();
            }}
            startIcon={<CheckIcon />}
            className="normal-case"
            loading={join.isPending || requestJoin.isPending}
          >
            {joinLabel}
          </Button>
        ) : (
          <Button
            startIcon={<CheckIcon />}
            className="normal-case"
            disabled
          >
            Following
          </Button>
        )}
        <Button
          size="small"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="normal-case"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1300 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <MenuList autoFocusItem>
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (anyPending) return;
                      unfollow.mutate({ clubId });
                    }}
                  >
                    Unfollow
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default JoinButton;

type JoinButtonSkeletonProps = {
  isHeader?: boolean;
};

export const JoinButtonSkeleton = ({ isHeader }: JoinButtonSkeletonProps) => {
  return (
    <Skeleton variant="rounded" className="rounded-full">
      <Button
        variant="contained"
        size={isHeader ? 'large' : 'small'}
        className="normal-case"
      >
        Follow
      </Button>
    </Skeleton>
  );
};
