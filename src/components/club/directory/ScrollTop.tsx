'use client';

import { LeftArrowIcon } from '@src/icons/Icons';

export default function ScrollTop() {
  function handleClick() {
    const div = document.querySelector('#top');
    div?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <button
      className="fixed bottom-20 right-4 z-50 rotate-90 cursor-pointer rounded-full bg-slate-500 p-2 opacity-60 transition-colors duration-300 hover:bg-slate-600"
      onClick={handleClick}
    >
      <LeftArrowIcon />
    </button>
  );
}
