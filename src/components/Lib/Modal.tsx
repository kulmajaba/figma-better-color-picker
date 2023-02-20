import classNames from 'classnames';
import React from 'react';

import './Modal.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<Props> = ({ visible, onClose, children }) => {
  const containerClassNames = classNames('modal-container', { 'modal-container--visible': visible });

  return (
    <div className={containerClassNames} onClick={onClose} aria-hidden={!visible}>
      <div className="modal-content">
        {/* TODO: close button */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
