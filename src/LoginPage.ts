require('dotenv').config();

import { Page } from 'puppeteer';
import { Config } from './config';
import { LOGIN_URL } from './const';
import {
  BUTTON_SUBMIT_SELECTOR,
  EMAIL_BUTTON_SELECTOR,
  INPUT_EMAIL_SELECTOR,
  INPUT_PASSWORD_SELECTOR, TV_DOMAIN,
  SIGN_IN_SELECTOR, TOPPAGE_SIDEBAR_SELECTOR
} from './const';

export class LoginPage {
  constructor(private page: Page) {
  }

  async setup(): Promise<void> {
    await Promise.all([
      this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' }),
      this.page.waitForSelector(EMAIL_BUTTON_SELECTOR),
    ]);
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
