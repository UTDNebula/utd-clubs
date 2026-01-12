'use client';

import Chip from '@mui/material/Chip';
import { useLayoutEffect, useRef, useState } from 'react';
import { ListItemText, Menu, MenuItem } from '@mui/material';

// Constants for layout calculation
const GAP = 4; // gap-1 is 4px
const CHIP_HEIGHT = 32; // Standard MUI Chip height
const ROW_BUFFER = 5; // Small buffer for rendering quirks

export const ClubTags = ({ tags }: { tags: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const [isReady, setIsReady] = useState(false); // only rendering calculated layout after mount (prevent hydration issue)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const calculateVisibleTags = () => {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children) as HTMLElement[];
      const maxLines = window.innerWidth < 768 ? 1 : 2; // 1 line on mobile
      const maxHeight = (CHIP_HEIGHT * maxLines) + ((maxLines - 1) * GAP) + ROW_BUFFER;

      let validCount = 0;

      // Iterate through rendered chips to see which ones fit within maxHeight
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        
        // Use offsetTop to determine which "row" the item is on
        // If the bottom of the child exceeds our calculated max height, it's overflowing
        if (child.offsetTop + child.offsetHeight <= maxHeight + container.offsetTop) {
          validCount++;
        } else {
          break;
        }
      }

      // If we have overflow, we might need to remove one more to fit the "..." button
      // This is a heuristic: if we aren't showing all, reduce by 1 to make room for AllTags button
      if (validCount < tags.length) {
        setVisibleCount(Math.max(0, validCount - 1));
      } else {
        setVisibleCount(tags.length);
      }
      
      setIsReady(true);
    };

    // Initial calculation
    calculateVisibleTags();

    // Re-calculate on resize
    const observer = new ResizeObserver(calculateVisibleTags);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [tags]);

  const visibleTags = tags.slice(0, isReady ? visibleCount : tags.length);
  const overflowTags = tags.slice(visibleCount);
  const hasOverflow = overflowTags.length > 0 && isReady;

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-wrap gap-1 mt-2 ${!isReady ? 'invisible' : ''}`}
    >
      {/* Scenario 1: During calculation (invisible), render ALL tags to measure them.
         Scenario 2: After calculation, render only VISIBLE tags.
      */}
      {(isReady ? visibleTags : tags).map((tag) => (
        <div key={tag} className="flex"> 
          <Chip
            label={tag}
            className="font-semibold bg-cornflower-100 text-cornflower-600 hover:bg-cornflower-200"
          />
        </div>
      ))}

      {/* Overflow Trigger & Menu */}
      {hasOverflow && (
        <div className="flex">
          <Chip
            label={`+${overflowTags.length} tags`}
            onClick={handleMenuOpen}
            className="font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
          />
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            slotProps={{
              paper: { className: 'max-h-40 mt-2 rounded-xl' },
            }}
          >
            {overflowTags.map((tag) => (
              <MenuItem key={tag} onClick={handleMenuClose}>
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
};