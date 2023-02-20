import React from 'react';
import strings from '../assets/strings';

import useIsPlugin from '../hooks/useIsPlugin';
import Modal, { Props as Modalprops } from './Lib/Modal';

type Props = Omit<Modalprops, 'title|children'>;

const InfoModal: React.FC<Props> = (props) => {
  const { isFigma, isPlugin } = useIsPlugin();

  let infoMessage = `${strings.info.info_1}`;
  isFigma && (infoMessage += ` ${strings.info.info_2_figma}`);
  !isPlugin && (infoMessage += ` ${strings.info.info_2_standalone}`);
  isPlugin && (infoMessage += `<br /><br />${strings.info.info_3_plugin}`);

  return (
    <Modal {...props} title="Help">
      <p dangerouslySetInnerHTML={{ __html: infoMessage }} />
    </Modal>
  );
};

export default InfoModal;
