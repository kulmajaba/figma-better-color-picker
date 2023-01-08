import React from 'react';
import { InputValue } from '../../types';
import Input from '../Input';

interface Props
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  type: 'number' | 'text';
  value: number | string;
  onChange: (value: InputValue) => boolean;
}

// TODO: is name needed?
const ColorComponentInput: React.FC<Props> = ({ type, value, onChange, ...inputProps }) => (
  <Input type={type} value={value} onChange={onChange} {...inputProps} />
);

export default ColorComponentInput;
