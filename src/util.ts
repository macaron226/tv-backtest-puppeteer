import * as _ from 'lodash';
import { Parameters } from './config';
import { ParameterColumn, ParameterRange } from './types';

// 各行の配列の組み合わせを取得します
// ex.
// [[1, 2, 3],[10, 20, 30]]
// ↓
// [[1,10], [1,20],[1,30],[2,10],...]
export function permutation<T>(input: T[][]): T[][] {
  let result: T[][] = [];
  for (let i = 0; i < input.length; ++i) {
    result = i === 0
    ? input[i].map(num => [num])
    : _.flatten(_.map(result, row => input[i].map(targetNum => [...row, targetNum])));
  }

  return result;
}

export const getParamCombination: (param: Parameters) => ParameterColumn[][] = (params: Parameters) => {
  const input = _.map(params, (param: ParameterRange, index: string) => {
    const range = _.range(param.min, param.max + 1);
    return range.map(num => ({ [index]: num }));
  });

  return permutation<ParameterColumn>(input);
};
