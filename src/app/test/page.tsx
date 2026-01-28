'use client';

import Button from '@mui/material/Button';
import { useSnackbar } from '@src/utils/Snackbar';

export default function Page() {
  const { setSnackbar } = useSnackbar();

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <Button onClick={() => setSnackbar('Message')}>String</Button>
        <Button onClick={() => setSnackbar({ message: 'Message' })}>
          Object
        </Button>
      </div>
      <div>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              autoHideDuration: 1000,
              closeOn: ['timeout'],
            })
          }
        >
          AutoHide
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message2',
              autoHideDuration: 1000,
              closeOn: ['timeout'],
            })
          }
        >
          AutoHide 2
        </Button>
      </div>
      <div>
        Close on click
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              closeOn: ['dismiss'],
            })
          }
        >
          Dismiss
        </Button>
      </div>
      <div>
        Types
        <Button
          onClick={() => setSnackbar({ message: 'Message', type: 'default' })}
        >
          Default
        </Button>
        <Button
          onClick={() => setSnackbar({ message: 'Message', type: 'success' })}
        >
          Success
        </Button>
        <Button
          onClick={() => setSnackbar({ message: 'Message', type: 'info' })}
        >
          Info
        </Button>
        <Button
          onClick={() => setSnackbar({ message: 'Message', type: 'warning' })}
        >
          Warning
        </Button>
        <Button
          onClick={() => setSnackbar({ message: 'Message', type: 'error' })}
        >
          Error
        </Button>
      </div>
      <div>
        Show close button
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              type: 'default',
              showClose: true,
            })
          }
        >
          Snackbar Content
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              type: 'success',
              showClose: true,
            })
          }
        >
          Alert
        </Button>
      </div>
      <div>
        Action
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              type: 'default',
              showClose: true,
              action: (
                <Button color="secondary" size="small">
                  Action
                </Button>
              ),
            })
          }
        >
          Snackbar Content
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              type: 'success',
              showClose: true,
              action: (
                <Button color="inherit" size="small">
                  Action
                </Button>
              ),
            })
          }
        >
          Alert
        </Button>
      </div>
      <div>
        Multiline
        <Button
          onClick={() =>
            setSnackbar({
              message: (
                <>
                  Line1
                  <br />
                  Line2
                </>
              ),
              type: 'default',
              showClose: true,
              action: (
                <Button color="secondary" size="small">
                  Action
                </Button>
              ),
            })
          }
        >
          Snackbar Content
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: (
                <>
                  Line1
                  <br />
                  Line2
                </>
              ),
              type: 'success',
              showClose: true,
              action: (
                <Button color="inherit" size="small">
                  Action
                </Button>
              ),
            })
          }
        >
          Alert
        </Button>
      </div>
      <div>
        Fit Content
        <Button
          onClick={() =>
            setSnackbar({
              message: (
                <>
                  Line1
                  <br />
                  Line2
                </>
              ),
              type: 'default',
              showClose: true,
              fitContent: true,
            })
          }
        >
          Snackbar Content
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: (
                <>
                  Line1
                  <br />
                  Line2
                </>
              ),
              type: 'success',
              showClose: true,
              fitContent: true,
            })
          }
        >
          Alert
        </Button>
      </div>
      <div>
        Alert Title
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              type: 'success',
              showClose: true,
            })
          }
        >
          None
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              title: true,
              type: 'success',
              showClose: true,
            })
          }
        >
          True
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              title: 'Custom',
              type: 'success',
              showClose: true,
            })
          }
        >
          Custom
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              title: 'Custom',
              type: 'default',
              showClose: true,
            })
          }
        >
          Default type
        </Button>
      </div>
    </div>
  );
}
