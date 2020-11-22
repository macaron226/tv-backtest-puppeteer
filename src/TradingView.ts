import puppeteer, { Page } from 'puppeteer';
import { getConfig, getStrategyConfig } from './config';
import { ChartPage } from './pages/ChartPage';
import { LoginPage } from './pages/LoginPage';
import { BacktestResult, Solution } from './types';
import construct = Reflect.construct;

export class TradingView {
  private config;
  private page: Page;
  // private loginPage: LoginPage;
  private chartPage: ChartPage;

  constructor(private isHeadless = false) {
    this.config = getConfig();
    this.getBacktestResult = this.getBacktestResult.bind(this);
  }

  async openChartPageSettings(chartPath: string): Promise<void> {
    let browser = await puppeteer.launch({ headless: this.isHeadless });
    this.page = await browser.newPage();

    await this.page.setViewport({ width: 1580, height: 1080 });

    // ログイン
    const loginPage = new LoginPage(this.page);
    await loginPage.login(this.config.email, this.config.password);
    // await browser.close();

    // browser = await puppeteer.launch({ headless: this.isHeadless });
    // this.page = await browser.newPage();
    // チャートページへ遷移
    this.chartPage = new ChartPage(this.page, chartPath);
    await this.chartPage.openStrategySetting();
  }

  async getBacktestResult(params: Solution): Promise<BacktestResult> {
    return await this.chartPage.getResultByParameters(params);
  }
}

//{ '6': 6, '7': 27, '8': 19 }