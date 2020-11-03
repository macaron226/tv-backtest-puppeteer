import puppeteer from 'puppeteer';
import { ChartPage } from './ChartPage';
import { getConfig } from './config';
import { LoginPage } from './LoginPage';

require('dotenv').config();

import * as _ from 'lodash';

(async () => {
  const config = getConfig();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080 });

  // ログイン
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.clickEmailLogin();
  await loginPage.typeEmail(config.email);
  await loginPage.typePassword(config.password);
  await loginPage.clickLoginButton();

  // チャートページへ遷移
  const chartPage = new ChartPage(page, config.chartPath);
  await chartPage.open();
  await chartPage.clickStrategyTesterTabIfNonActive();
  await chartPage.clickStrategySetting();
  await chartPage.getDialogContentDom();

  // await chartPage.inputToParameter(6, 123);
  const { indicator } = config;

  const indicators = _.map(indicator, (param, indexStr: string) => {
    return {
      index: _.toNumber(indexStr),
      ...param,
    };
  });

  for (const item of indicators) {
    const values = _.range(item.min, item.max + 1);
    console.log('values');
    console.log(values);

    for (const value of values) {
      await chartPage.inputToParameter(item.index, _.toString(value));
    }
  }

// SS
// https://knooto.info/puppeteer-page-screenshot-after-login/

  // browser.close();

})();
