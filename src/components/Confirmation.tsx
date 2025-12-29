'use client';

import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { ReactNode } from 'react';

interface ConfirmationProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  contentText: ReactNode;
  confirmText?: string;
  confirmColor?: ButtonProps['color'];
  onConfirm: () => void;
  loading?: boolean;
}

export default function Confirmation({
  open,
  onClose,
  title = 'Are you sure?',
  contentText,
  confirmText = 'Delete',
  confirmColor = 'error',
  onConfirm,
  loading,
}: ConfirmationProps) {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          autoFocus
          loading={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
