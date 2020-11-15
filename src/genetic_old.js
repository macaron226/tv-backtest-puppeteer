// import { ParameterDefs } from './config';
// import * as _ from 'lodash';
// import { BacktestResult, Solution } from './types';
//
// const Task = require('genetic').Task;
// const util = require('util');
//
// const GENETIC_PARAMS = {
//   minimize: false,
//   popSize: 5,
//   mutateProbability: 0.1,
//   crossoverProbability: 0.3,
//   generation: 3,
// };
//
// export class Genetic {
//   private readonly generation = GENETIC_PARAMS.generation;
//   private readonly options;
//   private readonly task;
//
//   constructor(parameterDefs: ParameterDefs, fitnessFunc) {
//     this.options = {
//       ...GENETIC_PARAMS,
//       // minimize: false,
//       // popSize: 500,
//       // mutateProbability: 0.1,
//       // crossoverProbability: 0.3,
//       getRandomSolution: this.getRandomSolutionFunc(parameterDefs),
//       stopCriteria: this.stopCriteria,
//       fitness: this.getFitness(fitnessFunc),
//       mutate: this.mutate,
//       crossover: this.crossOver,
//     };
//
//     console.log('new task');
//     this.task = new Task(this.options);
//     this.task.on('error', error => console.log('ERROR - ', error));
//   }
//
//   run() {
//     console.log('=== TEST BEGINS === ');
//     this.task.run(stats => console.log('results', stats));
//   }
//
//   getRandomSolutionFunc = (parameterDefs: ParameterDefs) => (callback) => {
//     const solution: Solution = _.reduce(parameterDefs, (carry, def, index) => ({ ...carry, [index]: _.random(def.min, def.max)}), {});
//
//     return callback(solution);
//   };
//
//
//   // getRandomSolution(callback) {
//   //   const solution = { a: Math.random(), b: Math.random(), c: Math.random() };
//   //   callback(solution)
//   // }
//
//   private crossOver = (parent1: Solution, parent2: Solution, callback) => {
//     const crossOverCount = Math.ceil(_.size(parent1) / 2);
//     const child: Solution = {...parent1, ..._.sampleSize(parent2, crossOverCount)};
//
//     callback(child);
//   };
//
//   private mutate(solution, callback) {
//     if (Math.random() < 0.3) {
//       solution.a = Math.random()
//     }
//     if (Math.random() < 0.3) {
//       solution.b = Math.random()
//     }
//     if (Math.random() < 0.3) {
//       solution.c = Math.random()
//     }
//     callback(solution)
//   }
//
//   stopCriteria() {
//     return (this.generation == 1000)
//   }
//
//   getFitness = (asyncGetResultFunc: (solution: Solution) => Promise<BacktestResult>) => (solution: Solution, callback) => {
//     console.log('asyncGetResultFunc(solution)');
//     console.log(asyncGetResultFunc(solution));
//     asyncGetResultFunc(solution).then((result: BacktestResult) => {
//       console.log('resolved!');
//       console.log('result.profitFactor');
//       console.log(result.profitFactor);
//       callback(result.profitFactor);
//     });
//   }
// }
//
//
// // t.on('run start', function () { console.log('run start'); util.log('run') })
// // t.on('run finished', function (results) { console.log('run finished - ', results); util.log('run')})
// // t.on('init start', function () { console.log('init start') })
// // t.on('init end', function (pop) { console.log('init end', pop) })
// // t.on('loop start', function () { console.log('loop start') })
// // t.on('loop end', function () { console.log('loop end') })
// // t.on('iteration start', function (generation) { console.log('iteration start - ',generation) })
// // t.on('iteration end', function () { console.log('iteration end') })
// // t.on('calcFitness start', function () { console.log('calcFitness start') })
// // t.on('calcFitness end', function (pop) { console.log('calcFitness end', pop) })
// // t.on('parent selection start', function () { console.log('parent selection start') })
// // t.on('parent selection end', function (parents) { console.log('parent selection end ',parents) })
// // t.on('reproduction start', function () { console.log('reproduction start') })
// //
// // t.on('find sum', function () { console.log('find sum') })
// // t.on('find sum end', function (sum) { console.log('find sum end', sum) })
//
// // t.on('statistics', function (statistics) { console.log('statistics',statistics)})
// //
// // t.on('normalize start', function () { console.log('normalize start') })
// // t.on('normalize end', function (normalized) { console.log('normalize end',normalized) })
// // t.on('child forming start', function () { console.log('child forming start') })
// // t.on('child forming end', function (children) { console.log('child forming end',children) })
// // t.on('child selection start', function () { console.log('child selection start') })
// // t.on('child selection end', function (population) { console.log('child selection end',population) })
// //
// // t.on('mutate', function () { console.log('MUTATION!') })
// //
// //
// // t.on('reproduction end', function (children) { console.log('reproduction end',children) })
// //
