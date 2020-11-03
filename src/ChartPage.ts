import { ElementHandle, Page } from 'puppeteer';
import {
  CHART_PAGE_ALERT_SELECTOR,
  CHART_URL,
} from './const';

import * as _ from 'lodash';

const STRATEGY_TESTER_TAB_SELECTOR = 'div[data-name="backtesting"]';
const STRATEGY_TESTER_TITLE_SELECTOR = 'div.backtesting-head-wrapper';

const STRATEGY_SETTING_BUTTON = 'div.js-backtesting-open-format-dialog'; // 設定ボタン
const SETTING_CONTENT_SELECTOR = 'div[data-name="indicator-properties-dialog"] div[class^="content"]'; // 設定画面
const SETTING_CELLS_SELECTOR = `${SETTING_CONTENT_SELECTOR} > *`; // 設定項目


export class ChartPage {
  private indicatorInputs: ElementHandle[] = [];

  constructor(private page: Page) {
  }

  async gotoChartPage(chartPath: string): Promise<void> {
    const chartUrl = `${ CHART_URL }/${ chartPath }`;
    await Promise.all([
      this.page.goto(chartUrl),
      this.page.waitForSelector(CHART_PAGE_ALERT_SELECTOR),
    ]);
  }

  async clickStrategyTesterTabIfNonActive(): Promise<void> {
    const isActive: string = await this.page.$eval(STRATEGY_TESTER_TAB_SELECTOR, e => e.getAttribute('data-active'));

    if (isActive !== 'true') {
      await Promise.all([
        this.page.click(STRATEGY_TESTER_TAB_SELECTOR),
        this.page.waitForSelector(STRATEGY_TESTER_TITLE_SELECTOR),
      ]);
    }
  }

  async clickStrategySetting(): Promise<void> {
    await Promise.all([
      this.page.click(STRATEGY_SETTING_BUTTON),
      this.page.waitForSelector(SETTING_CONTENT_SELECTOR)
    ]);
  }

  // 設定画面のDOMを取得
  async getDialogContentDom() {
    const rows: ElementHandle[] = await this.page.$$(SETTING_CELLS_SELECTOR);

    // 奇数番目のみにする（input）
    this.indicatorInputs = _.filter(rows, (row, i) => i % 2 === 1);
  }

  // index番目のパラメータに数字を入力
  async inputToParameter(index: number, value: string) {
    console.log('args');
    console.log(index, value);

    const cell: ElementHandle = _.get(this.indicatorInputs, index);
    if (!cell) {
      console.log('指定されたindexがないか、正しく取得できませんでした');
    }
    const input = await cell.$('input');

    // 3回クリックすることで既存入力を上書き
    await input.click({ clickCount: 3 });
    await input.type(value);

    // blurして結果更新
    await Promise.all([
      cell.$eval('input', (e: HTMLElement) => e.blur()),
      this.waitForUpdateResult(),
    ]);

    const result = await this.parseResult();
  }

  private async parseResult() {
    return {
      totalProfit: await this.getValue(await this.page.$('div > div.report-data > div:nth-child(1) > p > span')),
      tradeCount: await this.getValue(await this.page.$('div > div.report-data > div:nth-child(2) > strong')),
      drawDown: await this.getValue(await this.page.$('div > div.report-data > div:nth-child(5) > p > span > span')),
      profitFactor: await this.getValue(await this.page.$('div > div.report-data > div:nth-child(4) > strong')),
    };
  }

  private async getValue(element: ElementHandle) {
    return await (await element.getProperty('textContent')).jsonValue();
  }

  async waitForUpdateResult() {
    await Promise.race([
      this.page.waitFor(3000),
      this.page.waitFor(100000),
    ]);
  }
}