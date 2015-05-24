export * from './Controller'
export * from './Model'
export * from './Router'

export class Cheddar {
  static get database() {
    return this._database
  }

  static set database(url) {
    this._database = url
  }
}
