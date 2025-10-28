'use client';

import { useEffect, useState } from 'react';
import { LeftArrowIcon } from '@src/icons/Icons';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isTop =
        (document.querySelector('#top')?.getBoundingClientRect().top ?? 0) >= 0;
      setVisible(!isTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleClick() {
    const div = document.querySelector('#top');
    div?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <button
      className={
        'fixed right-4 bottom-4 z-50 rotate-90 cursor-pointer rounded-full bg-slate-500 p-2 opacity-60 transition-colors duration-300 hover:bg-slate-600' +
        (visible ? '' : ' hidden')
      }
      onClick={handleClick}
    >
      <LeftArrowIcon />
    </button>
  );
}
