import React from 'react';
import Header from '@src/components/header/Header';

const NotFound = ({ elementType }: { elementType: string }) => {
  return (
    <div className="absolute h-full w-full">
      <Header />
      <main className="font-bold">
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-slate-200 dark:text-slate-800">
          404
        </h1>
        <h2 className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-20 text-3xl text-slate-800 dark:text-slate-200">
          {elementType} not found
        </h2>
      </main>
    </div>
  );
};

export default NotFound;
