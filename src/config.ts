require('dotenv').config();
const fs = require('fs');
import * as _ from 'lodash';
import { ParameterRange } from './types';

const parameters: { [P in keyof any]: string } = {
  email: 'TV_EMAIL',
  password: 'TV_PASSWORD',
};

const getEnvConfig = () => {
  const envParams = process.env;

  const config = _.reduce(parameters, (carry, envKey, key) => {
    if (!_.has(envParams, envKey)) {
      throw new Error(`パラメータが定義されていません: ${ envKey }`);
    }

    return { ...carry, [key]: envParams[envKey] };
  }, {});

  return Object.freeze(config);
};

export const getStrategyConfig: () => StrategyConfig = () => {
  const strategy = process.env.PARAMETER_FILE;
  const params = fs.readFileSync(`./strategies/${ strategy }.json`, 'utf8');
  if (!params || params == '') {
    throw new Error('ファイル読み込みエラー');
  }

  return JSON.parse(params);
};

export const getConfig: () => Readonly<Config> = () => {
  return getEnvConfig();
};

export type Config = {
  email: string,
  password: string,
  chart: { path: string },
  indicator: object,
};

export type StrategyConfig = {
  chart: {
    path: string,
  },
  indicator: Parameters,
}
export type Parameters = {
  [index: string]: ParameterRange,
}

export type Parameter = {
  min: number,
  max: number,
}
