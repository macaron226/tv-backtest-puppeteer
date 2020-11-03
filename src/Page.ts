import { Page } from 'puppeteer';
import * as _ from 'lodash';

export abstract class AbstractPage {
  protected domain = 'https://jp.tradingview.com';

  protected abstract path: string;

  constructor(protected page: Page) {
  }

  abstract async open(): Promise<void>;

  protected getUrl(): string {
    return `${ this.domain }${ this.path }`;
  }

  protected async getValue(selector: string): Promise<string> {
    return await (
      await (
        await this.page.$(selector)
      ).getProperty('textContent')
    ).jsonValue();
  }
}