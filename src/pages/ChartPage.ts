import { ElementHandle, Page } from 'puppeteer';
import * as _ from 'lodash';
import { AbstractPage } from './Page';
import { BacktestResult, ParameterColumn } from '../types';

const CHART_PAGE_ALERT_SELECTOR = 'div[class^="widgetHeader"]';

const STRATEGY_TESTER_TAB_SELECTOR = 'div[data-name="backtesting"]';
const STRATEGY_TESTER_TITLE_SELECTOR = 'div.backtesting-head-wrapper';

const STRATEGY_SETTING_BUTTON = 'div.js-backtesting-open-format-dialog'; // 設定ボタン
const SETTING_CONTENT_SELECTOR = 'div[data-name="indicator-properties-dialog"] div[class^="content"]'; // 設定画面
const SETTING_CELLS_SELECTOR = `${ SETTING_CONTENT_SELECTOR } > div[class*="last-"]`; // 設定項目

const ANY_PARAM_INPUT_SELECTOR = 'input[class^="innerInput-"]';

export class ChartPage extends AbstractPage {
  protected path = '/chart';
  private indicatorInputs: ElementHandle[] = [];

  // 変わってたら結果更新とする
  private resultCache = '';

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

    // 入力項目を取得しておく
    this.indicatorInputs = await this.page.$$(SETTING_CELLS_SELECTOR);
  }

  // 全てのパラメータに数字を入力し、結果を取得する
  async getResultByParameters(params: { [key: string]: number }): Promise<BacktestResult> {
    // 同時アクセス可能なデバイス数のお知らせがでたら閉じる
    if (await this.page.$('[data-dialog-name="gopro"]')) {
      await this.page.click('button.close-button');
      await this.page.waitFor(2000);
    }

    console.log(params);
    for (const [index, value] of Object.entries(params)) {
      await this.inputToParameter(index, _.toString(value));
    }

    this.resultCache = await this.getValue('div > div.report-data > div:nth-child(1) > p > span');

    // blurして結果更新
    await Promise.all([
      this.page.$eval(ANY_PARAM_INPUT_SELECTOR, (e: HTMLElement) => e.blur()),
      this.waitForUpdateResult(),
    ]);

    return await this.parseResult();
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

  private async parseResult(): Promise<BacktestResult> {
    const reportData = await this.page.$('div > div.report-data');
    if (!reportData) {
      return { totalProfit: 0, tradeCount: 0, drawDown: 0, profitFactor: 0 };
    }

    return {
      totalProfit: await this.getNumberValue('div > div.report-data > div:nth-child(1) > p > span'),
      tradeCount: await this.getNumberValue('div > div.report-data > div:nth-child(2) > strong'),
      drawDown: await this.getNumberValue('div > div.report-data > div:nth-child(5) > p > span > span'),
      profitFactor: await this.getNumberValue('div > div.report-data > div:nth-child(4) > strong'),
    };
  }

  // https://stackoverflow.com/questions/54109078/puppeteer-wait-for-page-dom-updates-respond-to-new-items-that-are-added-after

  async waitForUpdateResult() {
    await Promise.race([
      // this.waitForUpdateRender(),
      this.page.waitFor(2000),
    ]);
  }

  // https://github.com/puppeteer/puppeteer/issues/2945

  async waitForUpdateRender() {
    // this.page.waitForFunction(async selector => {
    //   return this.resultCache != await this.getValue('div > div.report-data > div:nth-child(1) > p > span');
    // }, {}, 'div > div.report-data > div:nth-child(1) > p > span'),

    // await this.page.exposeFunction('getItem', function(a) {
    //     console.log(a);
    // });

    await this.page.evaluate(() => {
      const result = document.querySelector('div > div.report-data > div:nth-child(1) > p > span');
      // console.log(result);
        // var observer = new MutationObserver((mutations) => {
        //     for(var mutation of mutations) {
        //         if(mutation.addedNodes.length) {
        //             getItem(mutation.addedNodes[0].innerText);
        //         }
        //     }
        // });
        // observer.observe(document.getElementById("chat"), { attributes: false, childList: true, subtree: true });
    });
  }

  async getNumberValue(selector: string): Promise<number> {
    const value = await this.getValue(selector);
    return value ? _.toNumber(_.trim(value, '% ')) : 0;
  }
}