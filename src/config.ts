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
  try {
    const params = fs.readFileSync(`./strategies.json`, 'utf8');
    const strategy = _.get(JSON.parse(params), process.env.STRATEGY);

    if (!strategy || !strategy.chart || !strategy.parameters) {
      throw new Error(`strategyの形式が不正です: ${ process.env.STRATEGY }`);
    }

    return {
      chart: strategy.chart,
      parameterDefs: strategy.parameters,
    };

  } catch (e) {
    console.log(e);
    throw new Error('ファイル読み込みエラー');
  }
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
  chart: string,
  parameterDefs: ParameterDefs,
}
export type ParameterDefs = {
  [index: string]: ParameterRange,
}

export type Parameter = {
  min: number,
  max: number,
}
