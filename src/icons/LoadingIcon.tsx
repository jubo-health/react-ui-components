import React from 'react';

import './style.css';

const LoadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className='circular' height='24px' width='24px' {...props}>
    <circle
      className='path stroke-primary'
      cx='12'
      cy='12'
      r='9'
      fill='none'
      strokeWidth='2'
      strokeMiterlimit='10'
    />
  </svg>
);

export default LoadingIcon;
