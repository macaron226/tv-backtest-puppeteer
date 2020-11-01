import puppeteer from 'puppeteer';
import { ChartPage } from './ChartPage';
import { getConfig } from './config';
import { TV_DOMAIN } from './const';
import { LoginPage } from './LoginPage';
import {
  CHART_PAGE_ALERT_SELECTOR,
  CHART_URL,
  STRATEGY_ROW_SELECTOR,
  STRATEGY_SETTING_BUTTON
} from './const';

require('dotenv').config();


(async () => {
  const config = getConfig();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // await page.setViewport({
  //     width: 1920,
  //     height: 1080,
  // });

  // ログイン
  const loginPage = new LoginPage(page);
  await loginPage.setup();
  await loginPage.clickSignin();
  await loginPage.clickEmailLogin();
  await loginPage.typeEmail(config.email);
  await loginPage.typePassword(config.password);
  await loginPage.clickLoginButton();


  //blur
  // await page.$eval('input[name=email]', e => e.blur());

  // チャートページへ遷移
  const chartPage = new ChartPage(page);
  await chartPage.gotoChartPage(config.chartPath);
  await chartPage.clickStrategySetting();


  const param = '期間';

  // 指定されたラベルのinputを取得する

  await page.evaluate(selector => {

  });

  await page.waitFor(10000);

// SS
// https://knooto.info/puppeteer-page-screenshot-after-login/

  // browser.close();

})();
