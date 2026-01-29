'use client';

import Button from '@mui/material/Button';
import { useSnackbar } from '@src/components/global/Snackbar';

export default function Page() {
  const { setSnackbar } = useSnackbar();

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        Input type
        <Button onClick={() => setSnackbar('Message')}>String</Button>
        <Button onClick={() => setSnackbar({ message: 'Message' })}>
          Object
        </Button>
      </div>
      <div>
        Auto hide
        <Button
          onClick={() =>
            setSnackbar({
              message: 'Message',
              autoHideDuration: 500,
              closeOn: ['timeout'],
            })
          }
        >
          0.5 seconds
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
          1 second
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
          Default Type
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
          Alert Type
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
          Default Type
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
          Alert Type
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
          Default Type
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
          Alert Type
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
          Default Type
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
          Alert Type
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
      <div>
        updateCurrent?
        <Button
          onClick={() =>
            setSnackbar({
              message: 'updateCurrent',
              type: 'success',
              showClose: true,
              updateCurrent: true,
            })
          }
        >
          true
        </Button>
        <Button
          onClick={() =>
            setSnackbar({
              message: "don't updateCurrent",
              type: 'info',
              showClose: true,
            })
          }
        >
          false
        </Button>
      </div>
    </div>
  );
}
