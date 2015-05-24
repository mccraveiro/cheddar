export class Query {
  constructor(Model) {
    this.Model = Model
    this.query = {}
    this.options = {}
  }

  where(query = {}) {
    Object.assign(this.query, query)
    return this
  }

  skip(skip) {
    this.options.skip = skip
    return this
  }

  limit(limit) {
    this.options.limit = limit
    return this
  }

  async count(query = {}) {
    Object.assign(this.query, query)

    return await this.Model.collection.count(this.query)
  }

  async find(query = {}, options = {}) {
    Object.assign(this.query, query)
    Object.assign(this.options, options)

    let documents = await this.Model.collection.find(this.query, this.options)
    for (let i in documents) { documents[i] = new this.Model(documents[i]) }
    return documents
  }

  async findOne(query = {}, options = {}) {
    Object.assign(this.query, query)
    Object.assign(this.options, options)

    let document = await this.Model.collection.findOne(this.query, this.options)
    if (document) { return new this.Model(document) }
    else { return null }
  }

  async remove(query = {}) {
    Object.assign(this.query, query)

    return await this.Model.collection.remove(this.query)
  }

  static get methods() {
    return ['where', 'skip', 'limit', 'count', 'find', 'findOne', 'remove']
  }
}
