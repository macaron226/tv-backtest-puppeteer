import puppeteer from 'puppeteer';
import { getConfig } from './config';
import { login } from './login';
import { CHART_URL } from './selectors';

require('dotenv').config();


(async () => {
  const config = getConfig();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await login(page, config);

  await page.waitFor(2000);

  const chartPageUrl = `${CHART_URL}/${config.chartPath}`;
  // await page.goto()

  browser.close();


})();
