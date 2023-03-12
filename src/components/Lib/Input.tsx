import React, { forwardRef, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';

import { InputValue } from '../../types';

import './Input.css';

interface Props
  extends Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'onBlur' | 'onSubmit'
  > {
  onChange?: (value: InputValue) => void;
  onBlur?: (value: InputValue) => boolean | void;
  onSubmit?: (value: InputValue) => void;
  selectAllOnFocus?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      value: valueProp,
      onChange: onChangeProp,
      onBlur: onBlurProp,
      onSubmit: onSubmitProp,
      required = true,
      selectAllOnFocus = true,
      className,
      ...inputProps
    },
    ref
  ) => {
    const [value, setValue] = useState(valueProp);

    useEffect(() => {
      setValue(valueProp);
    }, [valueProp]);

    const onFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (selectAllOnFocus) {
          e.target.select();
        }
      },
      [selectAllOnFocus]
    );

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChangeProp) {
        onChangeProp(e.currentTarget.value);
      } else {
        setValue(e.currentTarget.value);
      }
    }, []);

    const onBlur = useCallback(() => {
      if (required && value === '') {
        setValue(valueProp);
        return;
      }

      if (onBlurProp) {
        const changed = onBlurProp(value);
        if (changed !== undefined && !changed) {
          setValue(valueProp);
        }
      }
    }, [onBlurProp, value, valueProp]);

    const onSubmit = useCallback(
      (value: InputValue) => {
        if (required && value === '') {
          setValue(valueProp);
          return;
        }

        if (onSubmitProp) {
          const changed = onSubmitProp(value);
          if (changed !== undefined && !changed) {
            setValue(valueProp);
          }
        }
      },
      [onSubmitProp, valueProp]
    );

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.blur();
          onSubmit(e.currentTarget.value);
        }
      },
      [onSubmit]
    );

    const inputClassNames = classNames('Input', 'u-focusBorder', className);

    return (
      <input
        ref={ref}
        className={inputClassNames}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        {...inputProps}
      />
    );
  }
);

export default Input;
