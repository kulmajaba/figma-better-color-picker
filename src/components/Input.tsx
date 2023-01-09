import React, { useCallback, useEffect, useState } from 'react';
import { InputValue } from '../types';

interface Props
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange: (value: InputValue) => boolean;
}

const Input: React.FC<Props> = ({ value: valueProp, onChange: onChangeProp, ...inputProps }) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.blur();
    }
  }, []);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value), []);

  const onBlur = useCallback(() => {
    if (onChangeProp && value !== valueProp) {
      const changed = onChangeProp(value);
      if (!changed) {
        setValue(valueProp);
      }
    }
  }, [onChangeProp, value, valueProp]);

  return <input value={value} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} {...inputProps} />;
};

export default Input;
