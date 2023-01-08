import React from 'react';
import { InputValue } from '../../types';
import Input from '../Input';

interface Props
  extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  componentIndex: number;
  type: 'number' | 'text';
  value: number | string;
  onChange: (componentIndex: number, value: InputValue) => boolean;
}

// TODO: is name needed?
const ColorComponentInput: React.FC<Props> = ({ componentIndex, type, value, onChange, ...inputProps }) => (
  <Input type={type} value={value} onChange={(value) => onChange(componentIndex, value)} {...inputProps} />
);

export default ColorComponentInput;
