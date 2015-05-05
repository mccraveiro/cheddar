import monk from 'monk'
import co_monk from 'co-monk'
import pluralize from 'pluralize'

let collection         = Symbol('collection')
let middlewares        = Symbol('middlewares')
let execute_middleware = Symbol('execute_middleware')

export default class Model {
  constructor() {
    this[middlewares] = {
      before: { create: [], delete: [], save: [] },
      after:  { create: [], delete: [], save: [] }
    }

    this.configure && this.configure()
    this[execute_middleware]('before', 'create')
    this[collection] = this.constructor.get_collection()
    this.id = this[collection].id()
    this[execute_middleware]('after', 'create')
  }

  before(action, middleware) {
    this[middlewares].before[action].push(middleware)
  }

  after(action, middleware) {
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

  *save() {
    this[execute_middleware]('before', 'save')

    // Build collection instance
    let obj = Object.assign({}, this)
    obj._id = obj.id
    delete obj.id

    yield* this[collection].update(obj._id, obj, { upsert: true })
    this[execute_middleware]('after', 'save')

    return this
  }

  *delete() {
    this[execute_middleware]('before', 'delete')
    yield* this[collection].removeById(this.id)
    this[execute_middleware]('after', 'delete')
    return this
  }

  [execute_middleware](timing, action) {
    this[middlewares][timing][action].forEach(middleware => {
      middleware.call(this)
    })
  }

  static get_collection() {
    let database = monk('localhost/app')
    let collection_name = pluralize(this.name).toLowerCase()
    return co_monk(database.get(collection_name))
  }

  static count(query = {}) {
    return this.get_collection().count(query)
  }

  static find() {
    // TODO
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
