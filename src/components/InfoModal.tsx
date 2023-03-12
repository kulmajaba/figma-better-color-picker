import React from 'react';

import strings from '../assets/strings';
import useIsPlugin from '../hooks/useIsPlugin';
import Icon from './Lib/Icon';
import Modal, { Props as Modalprops } from './Lib/Modal';

import './InfoModal.css';

type Props = Omit<Modalprops, 'title' | 'children'>;

const InfoModal: React.FC<Props> = (props) => {
  const { isFigma, isPlugin } = useIsPlugin();

  let infoMessage = strings.info.info_1;
  isFigma && (infoMessage += ` ${strings.info.info_2_figma}`);
  !isPlugin && (infoMessage += ` ${strings.info.info_2_standalone}`);
  isPlugin && (infoMessage += `<br /><br />${strings.info.info_3_plugin}`);

  return (
    <Modal {...props} title={strings.info.title}>
      <p className="InfoModal-p" dangerouslySetInnerHTML={{ __html: infoMessage }} />
      <a href="https://github.com/kulmajaba/figma-better-color-picker" target="_blank" rel="noreferrer noopener">
        <Icon icon="github_mark" />
      </a>
    </Modal>
  );
};

export default InfoModal;
