import React, { useEffect, useState } from 'react';

interface Props
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange?: (value: string | number | readonly string[] | undefined) => boolean;
}

const Input: React.FC<Props> = ({ value: valueProp, onChange, ...inputProps }) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.blur();
    }
  };

  const onBlur = () => {
    if (onChange && value !== valueProp) {
      const changed = onChange(value);
      if (!changed) {
        setValue(valueProp);
      }
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      {...inputProps}
    />
  );
};

export default Input;
