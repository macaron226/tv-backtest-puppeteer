require('dotenv').config();

import {
  BUTTON_SUBMIT_SELECTOR,
  EMAIL_BUTTON_SELECTOR,
  INPUT_EMAIL_SELECTOR,
  INPUT_PASSWORD_SELECTOR,
  SIGN_IN_SELECTOR, TOPPAGE_TITLE_SELECTOR
} from './selectors';

const EMAIL = process.env.TV_EMAIL;
const PASSWORD = process.env.TV_PASSWORD;
const LOGIN_URL = process.env.TV_LOGIN_URL;

export const login = async page => {
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
  await page.type(INPUT_EMAIL_SELECTOR, EMAIL); // ユーザー名入力
  await page.type(INPUT_PASSWORD_SELECTOR, PASSWORD); // パスワード入力

  // ログインボタンクリック
  await Promise.all([
    page.click(BUTTON_SUBMIT_SELECTOR),
    page.waitForSelector(TOPPAGE_TITLE_SELECTOR),
    // page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);
};