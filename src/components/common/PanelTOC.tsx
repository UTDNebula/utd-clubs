'use client';

import Typography from '@mui/material/Typography';
import { ComponentProps, Suspense, useEffect, useRef, useState } from 'react';
import { PanelItem, usePanelGroup } from './PanelGroup';

type PanelTOCProps = ComponentProps<'div'> & {
  align?: 'left' | 'center' | 'right';
};

const PanelTOC = (props: PanelTOCProps) => {
  const { panels } = usePanelGroup();
  const align = props.align ?? 'left';

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // setPanelVisibility((prev) => ({ ...prev, details: true, forms: true }));
  };

  const ids = panels.flatMap((panel) => {
    if (panel.props.heading) {
      return panel.props.id;
    } else {
      return [];
    }
  });

  // const panelDistance = useRef<Record<string, number>>(
  //   Object.fromEntries(ids.map((id) => [id, 0])),
  // );
  // console.log('panelDistance on mount', panelDistance);

  // const panelVisibility = useRef<Record<string, boolean>>(
  //   Object.fromEntries(ids.map((id) => [id, false])),
  // );

  const idsWithDefaultValue = <T,>(value: T) => {
    const temp: Record<string, typeof value> = {};

    for (const id of ids) {
      temp[id] = value;
    }
    return temp;
  };

  const [panelDistance, setPanelDistance] = useState<Record<string, number>>(
    // Object.fromEntries(ids.map((id) => [id, 0])),
    idsWithDefaultValue(0),
  );

  const [panelVisibility, setPanelVisibility] = useState<
    Record<string, boolean>
  >(
    // Object.fromEntries(ids.map((id) => [id, false]))
    idsWithDefaultValue(false),
  );

  // console.log('idsWithDefaultValue(0)', idsWithDefaultValue(0));
  // console.log('test', Object.fromEntries(ids.map((id) => [id, 0])));

  console.log('panelDistance on render', panelDistance);

  // const [visiblePanels, setVisiblePanels] = useState<boolean[]>(ids.forEach(id=>{id})
  // Array(panels.length).fill(false),
  // );

  const refs = panels.map((panel) => {
    if (panel.props.heading) {
      return panel.ref;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      console.log('resize');
      console.log('panels', panels);
      panels.forEach((panel) => {
        console.log('resize panel ite');
        if (panel.ref?.current) {
          console.log('if');
          const distance =
            panel.ref.current.getBoundingClientRect().top + window.scrollY;
          // panelDistance.current = {
          //   ...panelDistance.current,
          //   [panel.props.id]: distance,
          // };
          setPanelDistance((prev) => ({ ...prev, [panel.props.id]: distance }));
          console.log('new panelDistance', panelDistance);
        } else {
          console.log('else');
        }
      });
      // if (measureRef.current) {
      //   originalOffset.current =
      //     measureRef.current.getBoundingClientRect().top + window.scrollY;
      // }
    };
    handleResize();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      console.log(scrollY);
      panels.forEach((panel) => {
        const distance = panelDistance[panel.props.id];
        // const distance = panelDistance.current[panel.props.id];
        if (distance) {
          const visibility = scrollY > distance;
          // panelVisibility.current = {
          //   ...panelVisibility.current,
          //   [panel.props.id]: visibility,
          // };
          setPanelVisibility((prev) => ({
            ...prev,
            [panel.props.id]: visibility,
          }));
        }
      });
      console.log(panelDistance);

      // setIsSticky(scrollY > originalOffset.current);
      // setHeaderGradientOpacity((scrollY - originalOffset.current) / 128);
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div {...props} className={`px-4 py-2 ${props.className}`}>
      <Suspense fallback={<span>loading</span>}>
        {panels.map((panel: PanelItem) => {
          if (panel.props.heading) {
            return (
              <div
                key={panel.props.id}
                onClick={() => scrollTo(panel.props.id)}
                className={`cursor-pointer py-1 hover:text-neutral-900 dark:hover:text-neutral-100 transition
                  ${panelVisibility[panel.props.id] === true ? 'text-royal dark:text-cornflower-300' : 'text-neutral-600 dark:text-neutral-400'}
                  ${align === 'left' ? 'text-left hover:translate-x-1' : align === 'center' ? 'text-center hover:-translate-y-0.5' : 'text-right hover:-translate-x-1'}`}
              >
                <Typography variant="body1">
                  {panel.props.sidebarHeading ?? panel.props.heading}
                </Typography>
              </div>
            );
          }
          return;
        })}
      </Suspense>
    </div>
  );
};

export default PanelTOC;
