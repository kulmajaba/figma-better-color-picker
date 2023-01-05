import { InputValue } from '../types';
import { InvalidArgumentError } from './errors';

export const inputValueToNumber = (val: InputValue): number => {
  if (typeof val === 'number') {
    return val;
  } else if (typeof val === 'string') {
    return parseFloat(val);
  } else {
    throw new InvalidArgumentError(`Could not parse ${val} to number`);
  }
};

export const inputValueToString = (val: InputValue): string => {
  if (val) {
    return val.toString();
  } else {
    throw new InvalidArgumentError(`Could not parse ${val} to string`);
  }
};
