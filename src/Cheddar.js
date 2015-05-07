export * from './Controller'
export * from './Model'
export * from './Router'

let database = Symbol('database')

export class Cheddar {
  static get database() {
    return this[database]
  }

  static set database(url) {
    this[database] = url
  }
}
