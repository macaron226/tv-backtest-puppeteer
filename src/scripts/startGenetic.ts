 import { getStrategyConfig } from '../config';
 import { Genetic } from '../Genetic';
 import { TradingView } from '../TradingView';

(async () => {
  const { parameterDefs, chart } = getStrategyConfig();

  const tv = new TradingView();
  await tv.openChartPageSettings(chart);

  const genetic = new Genetic(parameterDefs, tv.getBacktestResult);
  genetic.run();
  // console.log(5);
})();