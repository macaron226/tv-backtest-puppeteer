import * as _ from 'lodash';

const parameters: { [P in keyof Config]: string } = {
  email: 'TV_EMAIL',
  password: 'TV_PASSWORD',
  chartPath: 'TV_CHART_PATH',
};

export const getConfig: () => Readonly<Config> = () => {
  const envParams = process.env;

  const config = _.reduce(parameters, (carry, envKey, key) => {
    if (!_.has(envParams, envKey)) {
      throw new Error(`パラメータが定義されていません: ${ envKey }`);
    }

    return {...carry, [key]: envParams[envKey]};
  }, {});

  return Object.freeze(config);
};

export type Config = {
  email: string,
  password: string,
  chartPath: string,
};

// interface Config {
//   auth: {
//     email: string,
//     password: string,
//   },

// }