import React from 'react';
import { InputValue } from '../../types';
import Input from '../Input';

interface Props<T extends string>
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  component: T;
  type: 'number' | 'text';
  value: number | string;
  onChange: (component: T, value: InputValue) => boolean;
}

const ColorComponentInput = <T extends string>({ component, type, value, onChange, ...inputProps }: Props<T>) => (
  <Input name={component} type={type} value={value} onChange={(value) => onChange(component, value)} {...inputProps} />
);

export default ColorComponentInput;
