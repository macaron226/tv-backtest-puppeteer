import * as _ from 'lodash';

// 各行の配列の組み合わせを取得します
// ex.
// [[1, 2, 3],[10, 20, 30]]
// ↓
// [[1,10], [1,20],[1,30],[2,10],...]
export function permutation(input: any[][]) {
  let result = [];
  for (let i = 0; i < input.length; ++i) {
    result = i === 0
    ? input[i].map(num => [num])
    : _.flatten(_.map(result, row => input[i].map(targetNum => [...row, targetNum])));
  }

  return result;
}