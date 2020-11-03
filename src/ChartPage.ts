import { ElementHandle, Page } from 'puppeteer';
import * as _ from 'lodash';
import { AbstractPage } from './Page';
import { ParameterColumn } from './types';

const CHART_PAGE_ALERT_SELECTOR = 'div[class^="widgetHeader"]';

const STRATEGY_TESTER_TAB_SELECTOR = 'div[data-name="backtesting"]';
const STRATEGY_TESTER_TITLE_SELECTOR = 'div.backtesting-head-wrapper';

const STRATEGY_SETTING_BUTTON = 'div.js-backtesting-open-format-dialog'; // 設定ボタン
const SETTING_CONTENT_SELECTOR = 'div[data-name="indicator-properties-dialog"] div[class^="content"]'; // 設定画面
const SETTING_CELLS_SELECTOR = `${ SETTING_CONTENT_SELECTOR } > *`; // 設定項目

const ANY_PARAM_INPUT_SELECTOR = 'input[class^="innerInput-"]';

export class ChartPage extends AbstractPage {
  protected path = '/chart';
  private indicatorInputs: ElementHandle[] = [];

  constructor(protected page: Page, private chartPath: string) {
    super(page);
  }

  async openStrategySetting(): Promise<void> {
    await this.open();
    await this.clickStrategyTesterTabIfNonActive();
    await this.clickStrategySetting();
  }

  async open(): Promise<void> {
    await Promise.all([
      this.page.goto(`${ this.getUrl() }/${ this.chartPath }`),
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

    // 項目を取得しておく
    const rows: ElementHandle[] = await this.page.$$(SETTING_CELLS_SELECTOR);
    // 奇数番目のみにする（input）
    this.indicatorInputs = _.filter(rows, (row, i) => i % 2 === 1);
  }

  // 全てのパラメータに数字を入力
  async inputToParameters(params: { [key: string]: number }[]) {
    console.log(params);
    for (const [index, value] of Object.entries(params)) {
      await this.inputToParameter(index, _.toString(value));
    }

    // blurして結果更新
    await Promise.all([
      this.page.$eval(ANY_PARAM_INPUT_SELECTOR, (e: HTMLElement) => e.blur()),
      this.waitForUpdateResult(),
    ]);

    const result = await this.parseResult();
    console.log(result);
  }

  // index番目のパラメータに数字を入力
  async inputToParameter(index: string, value: string) {
    const cell: ElementHandle = _.get(this.indicatorInputs, index);
    if (!cell) {
      throw new Error('指定されたindexがないか、正しく取得できませんでした');
    }
    const input = await cell.$('input');

    // 3回クリックすることで既存入力を上書き
    await input.click({ clickCount: 3 });
    await input.type(value);
  }

  private async parseResult() {
    return {
      totalProfit: await this.getNumberValue('div > div.report-data > div:nth-child(1) > p > span'),
      tradeCount: await this.getNumberValue('div > div.report-data > div:nth-child(2) > strong'),
      drawDown: await this.getNumberValue('div > div.report-data > div:nth-child(5) > p > span > span'),
      profitFactor: await this.getNumberValue('div > div.report-data > div:nth-child(4) > strong'),
    };
  }

  async waitForUpdateResult() {
    await Promise.race([
      this.page.waitFor(3000),
      this.page.waitFor(100000),
    ]);
  }

  async getNumberValue(selector: string): Promise<number> {
    return _.toNumber(_.trim(await this.getValue(selector), '% '));
  }
}