import React from 'react';
import { InputValue } from '../../types';
import Input from '../Input';

interface Props<T extends string> {
  component: T;
  type: 'number' | 'text';
  value: number | string;
  onChange: (component: T, value: InputValue) => boolean;
}

const ColorComponentInput = <T extends string>({ component, type, value, onChange }: Props<T>) => (
  <Input name={component} type={type} value={value} onChange={(value) => onChange(component, value)} />
);

export default ColorComponentInput;
