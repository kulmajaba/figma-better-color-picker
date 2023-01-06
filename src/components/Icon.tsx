import React, { FC } from 'react';

/* Example
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="black"/>
</svg>
*/

const icons = {
  eyedropper:
    'M17.6594 5.41L18.5794 6.33L15.8894 9.02L14.9694 8.1L17.6594 5.41ZM17.6694 3C17.4094 3 17.1594 3.1 16.9594 3.29L13.8394 6.41L11.9094 4.5L10.4994 5.91L11.9194 7.33L2.99939 16.25V21H7.74939L16.6694 12.08L18.0894 13.5L19.4994 12.09L17.5794 10.17L20.6994 7.05C21.0994 6.65 21.0994 6.02 20.7094 5.63L18.3694 3.29C18.1694 3.1 17.9194 3 17.6694 3ZM6.91939 19L4.99939 17.08L13.0594 9.02L14.9794 10.94L6.91939 19Z',
  add: 'M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  content_copy:
    'M16.5 1H4.5C3.4 1 2.5 1.9 2.5 3V17H4.5V3H16.5V1ZM19.5 5H8.5C7.4 5 6.5 5.9 6.5 7V21C6.5 22.1 7.4 23 8.5 23H19.5C20.6 23 21.5 22.1 21.5 21V7C21.5 5.9 20.6 5 19.5 5ZM19.5 21H8.5V7H19.5V21Z',
  delete:
    'M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z'
} as const;

interface Props {
  icon: keyof typeof icons;
  className?: string;
}

const Icon: FC<Props> = ({ icon, className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d={icons[icon]} fill="currentcolor" />
  </svg>
);

export default Icon;
