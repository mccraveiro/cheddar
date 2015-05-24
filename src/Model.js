import pluralize from 'pluralize'
import promisify from 'es6-promisify';
import {Cheddar} from './Cheddar'
import {Query} from './Query'

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
  constructor(properties = {}) {
    this._init()
    this._executeMiddleware('before', 'create')
    this._collection = this.constructor.collection
    this.id = this._collection.id()
    Object.assign(this, properties)
    this._executeMiddleware('after', 'create')
  }

  before(action, middleware) {
    this._init()
    this._middlewares.before[action].push(middleware)
  }

  after(action, middleware) {
    this._init()
    this._middlewares.before[action].push(middleware)
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
    this._executeMiddleware('before', 'save')
    let document = this._document
    await this._collection.update(document._id, document, { upsert: true })
    this._executeMiddleware('after', 'save')
    return this
  }

  async delete() {
    this._executeMiddleware('before', 'delete')
    await this._collection.removeById(this.id)
    this._executeMiddleware('after', 'delete')
    return this
  }

  _init() {
    if (!this._middlewares) {
      this._middlewares = {
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
  }

  _executeMiddleware(timing, action) {
    this._middlewares[timing][action].forEach(middleware => {
      middleware.call(this)
    })
  }

  get _document() {
    let obj = { _id: this.id }
    for (let prop of Object.getOwnPropertyNames(this)) {
      if (prop.startsWith('_') || prop === 'id') { continue }
      obj[prop] = this[prop]
    }
    return obj
  }

  static get collection() {
    let collectionName = pluralize(this.name).toLowerCase()
    let dbCollection = Cheddar._connection.get(collectionName)
    let methods = ['count', 'update', 'removeById', 'find', 'remove'];
    for (let method in methods) {
      dbCollection[method] = promisify(dbCollection[method])
    }
    return dbCollection
  }
}

/*eslint-disable no-loop-func*/
for (let method of Query.methods) {
  Model.prototype.constructor[method] = function (...args) {
    let query = new Query(this)
    return query[method].apply(query, args)
  }
}
/*eslint-enable no-loop-func*/
