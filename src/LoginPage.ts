require('dotenv').config();

import { AbstractPage } from './Page';

const EMAIL_BUTTON_SELECTOR = 'span.tv-signin-dialog__toggle-email';
const INPUT_EMAIL_SELECTOR = 'input[id^="email-signin__user-name-input"]';
const INPUT_PASSWORD_SELECTOR = 'input[id^="email-signin__password-input"]';
const BUTTON_SUBMIT_SELECTOR = 'button[id^="email-signin__submit-button"]';
// top
const TOPPAGE_SIDEBAR_SELECTOR = 'div[class^="toolbar"]';

export class LoginPage extends AbstractPage {
  protected path = '/#signin';

  async open(): Promise<void> {
    await Promise.all([
      this.page.goto(this.getUrl(), { waitUntil: 'domcontentloaded' }),
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
