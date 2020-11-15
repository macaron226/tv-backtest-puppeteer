import { Genetic } from 'async-genetic';


const solution = 'Insanity is doing the same thing over and over again and expecting different results';

export class MyGenetic {
  private GENERATIONS = 3000;
  private POPULATION = 2000;
  private population = [];

  private geneticFunc;

  constructor() {
    this.randomFunction = this.randomFunction.bind(this);
    this.mutationFunction = this.mutationFunction.bind(this);

    for (let i = 0; i < this.POPULATION; i++) {
      this.population.push(this.randomFunction());
    }

    this.geneticFunc = new Genetic<string>({
      mutationFunction: this.mutationFunction,
      crossoverFunction: this.crossoverFunction,
      fitnessFunction: this.fitnessFunction,
      randomFunction: this.randomFunction,
      populationSize: this.POPULATION,
      fittestNSurvives: 1,
    });
  }

  randomString(len: number) {
    let text = '';
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
  }

  replaceAt(str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length);
  }

  randomFunction() {
    // create random strings that are equal in length to solution
    return this.randomString(solution.length);
  }

  mutationFunction(entity: string) {
    // chromosomal drift
    const i = Math.floor(Math.random() * entity.length);
    return this.replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random() * 2) ? 1 : -1)));
  }

  crossoverFunction(mother: string, father: string) {
    // two-point crossover
    const len = mother.length;
    let ca = Math.floor(Math.random() * len);
    let cb = Math.floor(Math.random() * len);
    if (ca > cb) {
      const tmp = cb;
      cb = ca;
      ca = tmp;
    }

    const son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb);
    const daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb);

    return [son, daughter];
  }

  async fitnessFunction(entity: string) {
    let fitness = 0;

    let i;
    for (i = 0; i < entity.length; ++i) {
      // increase fitness for each character that matches
      if (entity[i] == solution[i]) fitness += 1;

      // award fractions of a point as we get warmer
      fitness += (127 - Math.abs(entity.charCodeAt(i) - solution.charCodeAt(i))) / 50;
    }

    return fitness;
  }

  async solve() {
    this.geneticFunc.seed();

    for (let i = 0; i <= this.GENERATIONS; i++) {
      console.count('gen');
      await this.geneticFunc.estimate();
      this.geneticFunc.breed();

      if (this.geneticFunc.best()[0] === solution) {
        break;
      }
    }
    console.log(this.geneticFunc.best(100));
  }
}
const genetic = new MyGenetic();

genetic.solve();
