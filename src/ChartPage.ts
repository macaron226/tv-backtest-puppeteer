import { Page } from 'puppeteer';
import {
  CHART_PAGE_ALERT_SELECTOR,
  CHART_URL,
  SETTING_CONTENT_SELECTOR,
  STRATEGY_ROW_SELECTOR,
  STRATEGY_SETTING_BUTTON
} from './const';

export class ChartPage {
  constructor(private page: Page) {
  }

  async gotoChartPage(chartPath: string): Promise<void> {
    const chartUrl = `${ CHART_URL }/${ chartPath }`;
    await Promise.all([
      this.page.goto(chartUrl),
      this.page.waitForSelector(CHART_PAGE_ALERT_SELECTOR),
    ]);
  }

  async clickStrategySetting(): Promise<void> {
    await this.page.click(STRATEGY_ROW_SELECTOR);

    await Promise.all([
      this.page.click(STRATEGY_SETTING_BUTTON),
      this.page.waitForSelector(SETTING_CONTENT_SELECTOR)
    ])
  }
}