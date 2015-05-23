import {User} from './factories/user'

const Models = []
Models.User = User

export class Factory {
  static async create(modelName, properties = {}) {
    let model = new Models[modelName]()
    model = Object.assign(model, properties)
    return await model.save()
  }

  static async createList(modelName, size, properties) {
    let list = Array(size);
    for (let i = 0; i < size; i++) {
      list[i] = this.create(modelName, properties)
    }
    return await Promise.all(list)
  }
}
