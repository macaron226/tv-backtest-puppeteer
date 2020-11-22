import { Genetic as GeneticFunc } from './ga/geneticAlgorithm';
import { ParameterDefs } from './config';
import { BacktestResult, Solution } from './types';
import * as _ from 'lodash';

// https://github.com/BusinessDuck/async-genetic

export class Genetic {
  private GENERATIONS = 30;
  private POPULATION = 20;
  private population = [];

  private geneticFunc: GeneticFunc<Solution>;

  constructor(getResultFn, parameterDefs) {
    // this.getRandomSolution = this.getRandomSolution.bind(this);
    this.mutation = this.mutation.bind(this);

    for (let i = 0; i < this.POPULATION; i++) {
      // this.population.push(this.getRandomSolution());
    }

    this.geneticFunc = new GeneticFunc<Solution>({
      mutationFunction: this.mutation,
      crossoverFunction: this.crossover,
      fitnessFunction: this.getFitnessFunc(getResultFn),
      randomFunction: this.getRandomSolutionFunc(parameterDefs),
      populationSize: this.POPULATION,
      fittestNSurvives: 1,
    });
  }


  getRandomSolutionFunc: ((def: ParameterDefs) => () => Solution) = (parameterDefs: ParameterDefs) => () => {
    return _.reduce(parameterDefs, (carry, def, index) => ({ ...carry, [index]: _.random(def.min, def.max)}), {});
  };
  // getRandomSolution(): Solution {
  //   // create random strings that are equal in length to solution
  //   return {"1": 1};
  // }

  mutation(solution: Solution): Solution {
    return solution;
  }

  crossover(mother: Solution, father: Solution): Solution[] {
    return [mother, father];
  }

  // async fitness(solution: Solution): Promise<number> {
  //
  //   console.log('calc fitness!');
  //   console.log(solution);
  //   const sol = await new Promise(resolve => {
  //     setTimeout(function() {
  //       resolve(1);
  //     }, 1000);
  //   });
  //   console.log('sol');
  //   console.log(sol);
  //   // const result = await getResultFn(solution);
  //
  //   return 1;
  // };

  getFitnessFunc = (getResultFn: (solution: Solution) => Promise<BacktestResult>) => async (solution: Solution) => {
    // console.log('calc fitness!');
    // console.log(solution);
    const result = await getResultFn(solution);
    console.log(result.profitFactor);

    return result.profitFactor;
  };

  async solve() {
    this.geneticFunc.seed();

    for (let i = 0; i <= this.GENERATIONS; i++) {
      console.count('gen');
      await this.geneticFunc.estimate();
      this.geneticFunc.breed();

      // if (this.geneticFunc.best()[0] === solution) {
      //   break;
      // }
    }
    console.log(this.geneticFunc.best(100));
  }
}

// const genetic = new Genetic();
// genetic.solve();

