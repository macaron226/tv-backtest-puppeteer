import puppeteer from 'puppeteer';
import { ChartPage } from './ChartPage';
import { getConfig, getStrategyConfig, Parameter, Parameters } from './config';
import { LoginPage } from './LoginPage';

require('dotenv').config();

import * as _ from 'lodash';
import { BacktestResult } from './types';
import { getParamCombination } from './util';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080 });

  // ログイン
  const loginPage = new LoginPage(page);
  await loginPage.login(config.email, config.password);

  // チャートページへ遷移
  const { chart, parameters } = getStrategyConfig();
  const chartPage = new ChartPage(page, chart.path);
  await chartPage.openStrategySetting();

  // await chartPage.inputToParameter(6, 123);

  const paramCombination = _.map(getParamCombination(parameters), (row: { [index: string]: number }) => {
    return _.reduce(row, (carry, value) => ({ ...carry, ...value }), {});
  }, []);

  let greatestResult: BacktestResult;
  for (const params of paramCombination) {
    const result = await chartPage.getResultByParameters(params);
    if (!greatestResult || result.profitFactor > greatestResult.profitFactor) {
      greatestResult = result;
      console.log('params');
      console.log(params);
      console.log(greatestResult);
    }
  }

  console.log('greatestResult');
  console.log(greatestResult);

// SS
// https://knooto.info/puppeteer-page-screenshot-after-login/

  // browser.close();

})();
