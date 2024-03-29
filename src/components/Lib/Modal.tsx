/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import { FC, useCallback } from 'react';

import classNames from 'classnames';

import Button from './Button';

import './Modal.css';

export interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: FC<Props> = ({ visible, onClose, title, children }) => {
  const containerClassNames = classNames('Modal', { 'is-visible': visible });

  const onContentClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation(), []);

  return (
    <div className={containerClassNames} onClick={onClose} aria-hidden={!visible}>
      <div className="Modal-content" onClick={onContentClick}>
        <div className="Modal-header">
          <Button className="Button--borderless" icon="close" onClick={onClose} />
          {title && <h2 className="Modal-heading">{title}</h2>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
