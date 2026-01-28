'use client';

import { type ComponentProps } from 'react';
import { RightArrowIcon, SearchIcon } from '@src/icons/Icons';

type SearchBarProps = Omit<ComponentProps<'input'>, 'type'> & {
  submitButton?: boolean;
  submitLogic?: () => void;
};

export const SearchBar = (props: SearchBarProps) => {
  const { submitButton, submitLogic, className, ...goodProps } = props;
  return (
    <div className="relative">
      <span className="absolute inset-y-0 flex items-center pl-3">
        <SearchIcon />
      </span>
      <input
        {...goodProps}
        type="text"
        className={`h-10 w-full rounded-full border pl-10 ${
          submitButton ? 'pr-[38px]' : 'pr-3'
        } focus:outline-hidden ${className ?? ''} border-gray-200 bg-white`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && typeof submitLogic !== 'undefined') {
            submitLogic();
          }
        }}
      />
      {submitButton && (
        <button
          type={typeof submitLogic !== 'undefined' ? 'button' : 'submit'}
          onClick={
            typeof submitLogic !== 'undefined'
              ? (e) => {
                  e.preventDefault();
                  submitLogic();
                }
              : undefined
          }
          className="absolute inset-y-0 right-2 flex items-center"
        >
          <RightArrowIcon fill="fill-[#C3CAD9]" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
