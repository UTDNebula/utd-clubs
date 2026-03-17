import Button from '@mui/material/Button';
import PaginationItem from '@mui/material/PaginationItem';
import Popover from '@mui/material/Popover';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export type CompactPaginationProps = {
  /**
   * The total number of pages.
   * @default 1
   */
  count?: number;
  /**
   * Callback fired when the page is changed.
   *
   * @param {number} page The page selected.
   */
  onChange?: (page: number) => void;
  /**
   * The current page. This paginations from `1`.
   */
  page?: number;
};

export default function CompactPagination({
  count = 1,
  onChange,
  page: pageControlled,
}: CompactPaginationProps = {}) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [pageUncontrolled, setPageUncontrolled] = useState(0);

  const page = pageControlled ?? pageUncontrolled;
  const setPage = useCallback(
    (action: SetStateAction<typeof page>) => {
      const newValue = typeof action === 'function' ? action(page) : action;
      setPageUncontrolled(action);
      onChange?.(newValue);
    },
    [onChange, page],
  );

  const disablePrev = page <= 0;
  const disableNext = page + 1 >= count;

  const [paginationWidth, setPaginationWidth] = useState(0);
  const paginationRef = useRef<HTMLDivElement>(null);

  const [openPageInput, setOpenPageInput] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [pageInputValue, setPageInputValue] = useState('');
  const [pageInputError, setPageInputError] = useState(false);

  const handleOpenPageInput = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenPageInput(true);
    setPageInputValue(String(page + 1));
    setPageInputError(false);
  };

  const handleClosePageInput = () => {
    setOpenPageInput(false);
    if (!pageInputError) {
      const newValue = Math.floor(Number(pageInputValue) - 1);
      setPage(newValue);
    }
  };

  const handleChangePageInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setPageInputValue(value);

    // Error if value is not a number or not in page range
    setPageInputError(
      Number.isNaN(Number(value)) ||
        Number(value) <= 0 ||
        Number(value) > count,
    );
  };

  // Set width of page input popover to width of inline pagination
  useEffect(() => {
    if (paginationRef.current) {
      setPaginationWidth(paginationRef.current.offsetWidth);
    }
  }, []);

  // Change page when pressing left or right arrow keys
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      // Ensures an editable input field is not selected
      if ((event.target as HTMLElement).matches(':read-write')) return;

      if (event.key === 'ArrowRight' && !disableNext) {
        setPage((prev) => prev + 1);
      } else if (event.key === 'ArrowLeft' && !disablePrev) {
        setPage((prev) => prev - 1);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disableNext, disablePrev, setPage]);

  return (
    <div>
      <div ref={paginationRef} className="flex">
        <Tooltip
          disableInteractive
          title={
            disablePrev ? undefined : (
              <span>
                Previous page{' '}
                <kbd className="outline-1 outline-white rounded-sm px-1 py-0.5 mx-1">
                  &larr;
                </kbd>
              </span>
            )
          }
        >
          <PaginationItem
            className="mx-0"
            type="previous"
            onClick={() => {
              if (!disablePrev) {
                setPage((prev) => prev - 1);
              }
            }}
            disabled={disablePrev}
          />
        </Tooltip>
        <PaginationItem
          role="textbox"
          className="mx-0 cursor-text outline-neutral-800 dark:outline-neutral-200 hover:outline-1"
          style={{
            // Ensures consistent min width of button, dependent on number of characters of button text
            // This ensures compactness while preventing the previous page button from shifting around
            minWidth: `${(page + 1).toString().length + 4 + count.toString().length}ch`,
          }}
          page={
            <>
              <span>{page + 1}</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                <span className="whitespace-pre"> of </span>
                <span>{count}</span>
              </span>
            </>
          }
          onClick={handleOpenPageInput}
        />
        <Tooltip
          disableInteractive
          title={
            disableNext ? undefined : (
              <span>
                Next page{' '}
                <kbd className="outline-1 outline-white rounded-sm px-1 py-0.5 mx-1">
                  &rarr;
                </kbd>
              </span>
            )
          }
        >
          <PaginationItem
            className="mx-0"
            type="next"
            onClick={() => {
              if (!disableNext) {
                setPage((prev) => prev + 1);
              }
            }}
            disabled={disableNext}
          />
        </Tooltip>
      </div>
      <Popover
        open={openPageInput}
        anchorEl={anchorEl}
        anchorReference={smallScreen ? 'none' : undefined}
        onClose={handleClosePageInput}
        disableRestoreFocus
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        transformOrigin={{ horizontal: 'center', vertical: 'center' }}
        slotProps={{
          paper: smallScreen
            ? {}
            : { elevation: 0, className: 'bg-transparent' },
          backdrop: { className: 'bg-black/50' },
        }}
        className={smallScreen ? 'flex justify-center w-screen p-4' : ''}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClosePageInput();
          }}
        >
          <div
            className={
              smallScreen ? 'flex flex-col gap-4 items-center mx-6 my-4' : ''
            }
          >
            {smallScreen && (
              <span className="text-neutral-700 dark:text-neutral-300">
                Go to page:
              </span>
            )}
            <TextField
              value={pageInputValue}
              onChange={handleChangePageInput}
              error={pageInputError}
              autoFocus
              onFocus={(e) => {
                // Select current contents when focused
                e.target.select();
              }}
              // Close whenenver input field is no longer focused (i.e. pressing "Done" on mobile devices)
              onBlur={handleClosePageInput}
              size="small"
              style={{
                width: smallScreen
                  ? `${Math.max(paginationWidth, 160)}px`
                  : `${paginationWidth}px`,
              }}
              slotProps={{
                root: {
                  className: 'bg-white dark:bg-neutral-900 rounded-full',
                },
                input: {
                  className: 'rounded-full',
                  endAdornment: (
                    <span className="text-neutral-600 dark:text-neutral-400">
                      /{count}
                    </span>
                  ),
                },
                htmlInput: {
                  className: 'text-center rounded-full p-0 h-8',
                  inputMode: 'numeric',
                },
              }}
            />
            {smallScreen && (
              <div className="flex justify-end w-full">
                <Button
                  type="submit"
                  variant="contained"
                  className="normal-case"
                  loadingPosition="start"
                  color="primary"
                >
                  OK
                </Button>
              </div>
            )}
          </div>
        </form>
      </Popover>
    </div>
  );
}
