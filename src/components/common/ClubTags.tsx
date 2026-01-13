'use client';

import { ListItemText, Menu, MenuItem } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TagChip } from './TagChip';

// Constants for layout calculation
const GAP = 4;
const CHIP_HEIGHT = 32;
const ROW_BUFFER = 5;

interface ClubTagsProps {
  tags: string[];
  size?: 'small' | 'medium';
}

export const ClubTags = (props: ClubTagsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(props.tags.length);

  const [isReady, setIsReady] = useState(false); // if false, all tags are rendered invisibly for measurement
  const lastWidthRef = useRef(0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useLayoutEffect(() => {
    if (!containerRef.current || isReady) return; // only measure when not ready (full list is rendered)

    const calculateVisibleTags = () => {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children) as HTMLElement[];
      const maxLines = window.innerWidth < 768 ? 1 : 2; // 1 line on mobile
      const maxHeight =
        CHIP_HEIGHT * maxLines + (maxLines - 1) * GAP + ROW_BUFFER;

      let validCount = 0;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.dataset.overflow) continue; // Skip overflow chip

        if (
          child.offsetTop + child.offsetHeight <=
          maxHeight + container.offsetTop
        )
          validCount++;
        else break;
      }

      // If we have overflow, remove 1 more tag to make space for the overflow Chip
      if (validCount < props.tags.length) {
        if (validCount > 0) {
          const containerRight = container.getBoundingClientRect().right;
          const lastChildRight =
            children[validCount - 1]!.getBoundingClientRect().right;
          const remainingSpace = containerRight - lastChildRight;

          const overflowWidth = props.tags.length - validCount == 1 ? 63 : 75; // estimated width of the overflow chip

          if (remainingSpace < GAP + overflowWidth) {
            setVisibleCount(Math.max(0, validCount - 1)); // make space for overflow chip
          } else {
            setVisibleCount(validCount); // enough space
          }
        } else {
          setVisibleCount(0); // no tags fit, show only overflow
        }
      } else {
        setVisibleCount(props.tags.length); // all tags fit
      }

      setIsReady(true);
    };

    calculateVisibleTags();
  }, [props.tags, isReady]);

  // observe container width changes to re-trigger measurement
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Calculate the absolute difference
        const widthDiff = Math.abs(
          entry.contentRect.width - lastWidthRef.current,
        );
        // 20px threshold: Ignores scrollbars (approx 17px) and minor layout jitters.
        if (widthDiff > 20) {
          lastWidthRef.current = entry.contentRect.width;
          setIsReady(false); //trigger re-measurement
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleTags = props.tags.slice(
    0,
    isReady ? visibleCount : props.tags.length,
  );
  const overflowTags = props.tags.slice(visibleCount);
  const hasOverflow = overflowTags.length > 0 && isReady;

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap gap-1 mt-2 ${!isReady ? 'invisible' : ''}`} // hide container when measuring
    >
      {/* Render all tags invisibly first to measure, then only the tags that fit visibly */}
      {(isReady ? visibleTags : props.tags).map((tag) => (
        <div key={tag} className="flex">
          <TagChip tag={tag} size={props.size} />
        </div>
      ))}

      {hasOverflow && (
        <div className="flex" data-overflow="true">
          <TagChip
            tag={`+${overflowTags.length} ${overflowTags.length === 1 ? 'tag' : 'tags'}`}
            onClick={handleMenuOpen}
            className="!font-bold !hover:bg-slate-300 !cursor-pointer"
          />
          {anchorEl && (
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
          )}
        </div>
      )}
    </div>
  );
};
