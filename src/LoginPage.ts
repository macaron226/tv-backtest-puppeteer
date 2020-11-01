require('dotenv').config();

import { Page } from 'puppeteer';
import { Config } from './config';
import {
  BUTTON_SUBMIT_SELECTOR,
  EMAIL_BUTTON_SELECTOR,
  INPUT_EMAIL_SELECTOR,
  INPUT_PASSWORD_SELECTOR, LOGIN_URL,
  SIGN_IN_SELECTOR, TOPPAGE_SIDEBAR_SELECTOR
} from './selectors';

export class LoginPage {
  constructor(private page: Page) {
  }

  async setup(): Promise<void> {
    await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  }

  async clickSignin(): Promise<void> {
    await Promise.all([
      this.page.click(SIGN_IN_SELECTOR),
      this.page.waitForSelector(EMAIL_BUTTON_SELECTOR),
    ]);
  }

  async clickEmailLogin(): Promise<void> {
    await Promise.all([
      this.page.click(EMAIL_BUTTON_SELECTOR),
      this.page.waitForSelector(INPUT_EMAIL_SELECTOR),
    ]);
  }

  async typeEmail(email: string): Promise<void> {
    await this.page.type(INPUT_EMAIL_SELECTOR, email);
    // await this.blur();
  }

  async typePassword(password: string): Promise<void> {
    await this.page.type(INPUT_PASSWORD_SELECTOR, password); // パスワード入力
  }

  async clickLoginButton(): Promise<void> {
    await Promise.all([
      this.page.click(BUTTON_SUBMIT_SELECTOR),
      this.page.waitForSelector(TOPPAGE_SIDEBAR_SELECTOR),
    ]);
  }
}

export const login = async (page, config: Config) => {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });

  await Promise.all([
    page.click(SIGN_IN_SELECTOR),
    page.waitForSelector(EMAIL_BUTTON_SELECTOR),
  ]);

  await Promise.all([
    page.click(EMAIL_BUTTON_SELECTOR),
    page.waitForSelector(INPUT_EMAIL_SELECTOR),
  ]);

  // 入力フォーム
  await page.type(INPUT_EMAIL_SELECTOR, config.email); // ユーザー名入力
  await page.type(INPUT_PASSWORD_SELECTOR, config.password); // パスワード入力

  // ログインボタンクリック
  await Promise.all([
    page.click(BUTTON_SUBMIT_SELECTOR),
    page.waitForSelector(TOPPAGE_SIDEBAR_SELECTOR),
    // page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);
};