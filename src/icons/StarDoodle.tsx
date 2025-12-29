import React from 'react';

interface Props {
  className?: string;
}

export default function NebulaLogo(props: Props) {
  return (
    <svg
      viewBox="0 0 73 74"
      xmlns="http://www.w3.org/2000/svg"
      fill="#FFF"
      className={props.className}
    >
      <path d="M31.1763 0.000436663L40.7471 30.812L72.6762 31.6213L42.2071 41.2002L41.4999 73.4562L31.9291 42.6447L-5.08637e-06 41.8353L30.4691 32.2565L31.1763 0.000436663Z" />
    </svg>
  );
}
