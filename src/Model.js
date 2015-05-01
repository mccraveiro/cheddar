let middlewares      = Symbol('middlewares')
let exec_middlewares = Symbol('exec_middlewares')

export default class Model {
  constructor() {
    this[middlewares] = {
      before: { create: [], delete: [], save: [] },
      after:  { create: [], delete: [], save: [] }
    }

    this.configure && this.configure()
    this[exec_middlewares]('before', 'create')
    // TODO: create model
    this[exec_middlewares]('after', 'create')
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
    this[exec_middlewares]('before', 'save')
    // TODO: save model
    this[exec_middlewares]('after', 'save')

    // TODO: replace {} with the query result
    yield {}
  }

  *delete() {
    this[exec_middlewares]('before', 'delete')
    // TODO: delete model
    this[exec_middlewares]('after', 'delete')

    // TODO: replace {} with the query result
    yield {}
  }

  [exec_middlewares](timing, action) {
    this[middlewares][timing][action].forEach(middleware => {
      middleware.call(this)
    })
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
