import { evaluate } from 'mathjs';

import { InvalidArgumentError } from './errors';

import { InputValue } from '../types';

const numberRegex = /^[0-9]*(?:[.,][0-9]+)*$/;
const arithmeticRegex = /^(?:[0-9]*(?:[.,][0-9]+)*(?: *[+\-*/] *)*)+$/;

export const inputValueToNumber = (val: InputValue): number => {
  if (typeof val === 'number') {
    return val;
  } else if (typeof val === 'string') {
    if (numberRegex.test(val)) {
      return parseFloat(val.replace(',', '.'));
    } else if (arithmeticRegex.test(val)) {
      return evaluate(val.replace(',', '.'));
    } else {
      throw new InvalidArgumentError(`Could not parse ${val} to number`);
    }
  } else {
    console.error(val);
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
