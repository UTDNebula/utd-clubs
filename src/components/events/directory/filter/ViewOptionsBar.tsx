import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GridViewIcon from '@mui/icons-material/GridView';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PaginationItem from '@mui/material/PaginationItem';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function ViewOptionsBar() {
  const [page, setPage] = useState(0);
  const maxPages = 10;

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
      setPage(Number(pageInputValue) - 1);
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
        Number(value) > maxPages,
    );
  };

  // Set width of page input popover to width of inline pagination
  useEffect(() => {
    if (paginationRef.current) {
      setPaginationWidth(paginationRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 px-1 text-neutral-600 dark:text-neutral-400">
        <Button
          size="small"
          color="inherit"
          className="normal-case"
          endIcon={<ArrowDropDownIcon />}
        >
          Relevant
        </Button>
        <IconButton size="small">
          <GridViewIcon
            fontSize="small"
            className="fill-neutral-600 dark:fill-neutral-400"
          />
        </IconButton>
      </div>
      <div>
        <div ref={paginationRef}>
          <PaginationItem
            className="mx-0"
            type="previous"
            onClick={() => {
              setPage((prev) => (prev >= 0 ? prev - 1 : prev));
            }}
            disabled={page <= 0}
          />
          <PaginationItem
            role="textbox"
            className="mx-0 cursor-text outline-neutral-800 dark:outline-neutral-200 hover:outline-1"
            style={{
              // Ensures consistent min width of button, dependent on number of characters of button text
              // This ensures compactness while preventing the previous page button from shifting around
              minWidth: `${(page + 1).toString().length + 4 + maxPages.toString().length}ch`,
            }}
            page={
              <>
                <span>{page + 1}</span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  <span className="whitespace-pre"> of </span>
                  <span>{maxPages}</span>
                </span>
              </>
            }
            onClick={handleOpenPageInput}
          />
          <PaginationItem
            className="mx-0"
            type="next"
            onClick={() => {
              setPage((prev) => (page + 1 < maxPages ? prev + 1 : prev));
            }}
            disabled={page + 1 >= maxPages}
          />
        </div>
        <Popover
          open={openPageInput}
          anchorEl={anchorEl}
          onClose={handleClosePageInput}
          disableRestoreFocus
          anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
          transformOrigin={{ horizontal: 'center', vertical: 'center' }}
          slotProps={{
            paper: { elevation: 0, className: 'bg-transparent' },
            backdrop: { className: 'bg-black/50' },
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClosePageInput();
            }}
          >
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
                width: `${paginationWidth}px`,
              }}
              slotProps={{
                root: {
                  className: 'bg-white dark:bg-neutral-900 rounded-full',
                },
                input: {
                  className: 'rounded-full',
                  endAdornment: (
                    <span className="text-neutral-600 dark:text-neutral-400">
                      /{maxPages}
                    </span>
                  ),
                },
                htmlInput: {
                  className: 'text-center rounded-full p-0 h-8',
                  inputMode: 'numeric',
                },
              }}
            />
          </form>
        </Popover>
      </div>
    </div>
  );
}
