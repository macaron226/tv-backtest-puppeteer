import puppeteer from 'puppeteer';
import { ChartPage } from './ChartPage';
import { getConfig } from './config';
import { TV_DOMAIN } from './const';
import { LoginPage } from './LoginPage';

require('dotenv').config();

import * as _ from 'lodash';

(async () => {
  const config = getConfig();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 825 });

  // ログイン
  const loginPage = new LoginPage(page);
  await loginPage.setup();
  await loginPage.clickEmailLogin();
  await loginPage.typeEmail(config.email);
  await loginPage.typePassword(config.password);
  await loginPage.clickLoginButton();


  //blur
  // await page.$eval('input[name=email]', e => e.blur());

  // チャートページへ遷移
  const chartPage = new ChartPage(page);
  await chartPage.gotoChartPage(config.chartPath);
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
  // await chartPage.getDialogContentDom();
  //
  // // 指定されたラベルのinputを取得する
  //
  // await page.evaluate(selector => {
  //
  // });
  //
  // await page.waitFor(1000000);

// SS
// https://knooto.info/puppeteer-page-screenshot-after-login/

  // browser.close();

})();
