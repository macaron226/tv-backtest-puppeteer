import { Page } from 'puppeteer';

export abstract class AbstractPage {
  protected domain = 'https://jp.tradingview.com';

  protected abstract path: string;

  constructor(protected page: Page) {
  }

  protected getUrl(): string {
    return `${this.domain}${this.path}`;
  }

  abstract async open(): Promise<void>;
}