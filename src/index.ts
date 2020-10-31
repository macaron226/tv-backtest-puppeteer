import puppeteer from 'puppeteer';
import { login } from './login';

require('dotenv').config();


(async () => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await login(page);

  await page.waitFor(3000);

  browser.close();


})();
