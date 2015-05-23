import monk from 'monk'
import pluralize from 'pluralize'
import promisify from 'es6-promisify';
import {Cheddar} from './Cheddar'

let collection = Symbol('collection')
let middlewares = Symbol('middlewares')
let initMiddlewares = Symbol('initMiddlewares')
let executeMiddleware = Symbol('executeMiddleware')

export function after(action) {
  return function (target, name, descriptor) {
    target.after.call(target, action, descriptor.value);
  }
}

export function before(action) {
  return function (target, name, descriptor) {
    target.before.call(target, action, descriptor.value);
  }
}

export class Model {
  constructor() {
    this[initMiddlewares]();
    this[executeMiddleware]('before', 'create')
    this[collection] = this.constructor.collection
    this.id = this[collection].id()
    this[executeMiddleware]('after', 'create')
  }

  before(action, middleware) {
    this[initMiddlewares]()
    this[middlewares].before[action].push(middleware)
  }

  after(action, middleware) {
    this[initMiddlewares]()
    this[middlewares].before[action].push(middleware)
  }

  ensure(property, options) {
    if (options.required && typeof this[property] === 'undefined') {
      throw new Error(`${property} is missing.`)
    }

    if (this[property] && options.type &&
        this[property].constructor !== options.type) {
      throw new Error(`${property} is not a ${options.type.name}.`)
    }
  }

  async save() {
    this[executeMiddleware]('before', 'save')

    // Build collection instance
    let obj = Object.assign({ _id: this.id }, this)
    delete obj.id

    await this[collection].update(obj._id, obj, { upsert: true })
    this[executeMiddleware]('after', 'save')

    return this
  }

  async delete() {
    this[executeMiddleware]('before', 'delete')
    await this[collection].removeById(this.id)
    this[executeMiddleware]('after', 'delete')
    return this
  }

  [initMiddlewares]() {
    if (this[middlewares]) {
      return;
    }

    this[middlewares] = {
      before: {
        create: [],
        delete: [],
        save: []
      },
      after: {
        create: [],
        delete: [],
        save: []
      }
    }
  }

  [executeMiddleware](timing, action) {
    this[middlewares][timing][action].forEach(middleware => {
      middleware.call(this)
    })
  }

  static get collection() {
    let database = monk(Cheddar.database)
    let collectionName = pluralize(this.name).toLowerCase()
    let dbCollection = database.get(collectionName)
    let methods = ['count', 'update', 'removeById', 'find', 'remove'];

    for (let method in methods) {
      dbCollection[method] = promisify(dbCollection[method])
    }

    return dbCollection
  }

  static async count(query = {}) {
    return await this.collection.count(query)
  }

  static async find(query = {}) {
    return await this.collection.find(query)
  }

  static async remove(query = {}) {
    return await this.collection.remove(query)
  }

  static all() {
    // TODO
  }

  static where() {
    // TODO
  }

  static skip() {
    // TODO
  }

  static limit() {
    // TODO
  }
}
