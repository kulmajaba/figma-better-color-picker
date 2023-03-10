import classNames from 'classnames';
import React, { useCallback } from 'react';
import Button from './Button';

import './Modal.css';

export interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({ visible, onClose, title, children }) => {
  const containerClassNames = classNames('modal-container', { 'modal-container--visible': visible });

  const onContentClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation(), []);

  return (
    <div className={containerClassNames} onClick={onClose} aria-hidden={!visible}>
      <div className="modal-content" onClick={onContentClick}>
        <div className="modal-header">
          <Button className="Button--borderless" icon="close" onClick={onClose} />
          {title && <h2>{title}</h2>}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
