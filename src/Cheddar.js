export { default as Controller } from './Controller'
export { default as Model } from './Model'
export { default as Router } from './Router'

export class Cheddar {
  static get database() {
    return this._database
  }

  static set database(url) {
    this._database = url
  }
}
