import puppeteer from 'puppeteer';
import { ChartPage } from '../pages/ChartPage';
import { getConfig, getStrategyConfig, Parameter, ParameterDefs } from '../config';
import { LoginPage } from '../pages/LoginPage';

require('dotenv').config();

import * as _ from 'lodash';
import { TradingView } from '../TradingView';
import { BacktestResult } from '../types';
import { getParamCombination } from '../util';

(async () => {

  const { chart, parameterDefs } = getStrategyConfig();

  const isHeadless = _.get(process.argv, 2) === 'true';
  const tv = new TradingView(isHeadless);
  await tv.openChartPageSettings(chart);

  const paramCombination = _.map(getParamCombination(parameterDefs), (row: { [index: string]: number }) => {
    return _.reduce(row, (carry, value) => ({ ...carry, ...value }), {});
  }, []);

  let greatestResult: BacktestResult;

  for (const params of paramCombination) {
    const result = await tv.getBacktestResult(params);
    if (!greatestResult || result.profitFactor > greatestResult.profitFactor) {
      greatestResult = result;
      console.log(params);
      console.log(greatestResult);
    }
  }

  console.log('------------ fin ------------');
  console.log('greatestResult');
  console.log(greatestResult);

// SS
// https://knooto.info/puppeteer-page-screenshot-after-login/

  // browser.close();

})();
