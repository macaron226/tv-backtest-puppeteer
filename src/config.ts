const fs = require('fs');
import * as _ from 'lodash';

const parameters: { [P in keyof any]: string } = {
  email: 'TV_EMAIL',
  password: 'TV_PASSWORD',
  chartPath: 'TV_CHART_PATH',
};

const getEnvConfig = () => {
  const envParams = process.env;

  const config = _.reduce(parameters, (carry, envKey, key) => {
    if (!_.has(envParams, envKey)) {
      throw new Error(`パラメータが定義されていません: ${ envKey }`);
    }

    return {...carry, [key]: envParams[envKey]};
  }, {});

  return Object.freeze(config);
};

const getParameterConfig = () => {
  const params = fs.readFileSync('./parameters.json', 'utf8');

  return JSON.parse(params);
};

export const getConfig: () => Readonly<Config> = () => {
  return {...getEnvConfig(), ...getParameterConfig()};
};

export type Config = {
  email: string,
  password: string,
  chartPath: string,
  indicator: object,
};

// interface Config {
//   auth: {
//     email: string,
//     password: string,
//   },

// }