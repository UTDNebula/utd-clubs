import React, { type FC } from 'react';
import Header from '@src/components/header/BaseHeader';

const NotFound: FC<{ elementType: string }> = ({ elementType }) => {
  return (
    <main className="absolute h-full w-full text-center">
      <Header />
      <div className="font-bold">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-slate-200">
          404
        </div>
        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-20 text-3xl text-slate-500">
          {elementType} not found
        </div>
      </div>
    </main>
  );
};

export default NotFound;
