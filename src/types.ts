export type ParameterColumn = {
  index: string;
  value: string;
}

export type ParameterRange = {
  min: number;
  max: number;
}

export type BacktestResult = {
  totalProfit: number;
  tradeCount: number;
  drawDown: number;
  profitFactor: number;
}