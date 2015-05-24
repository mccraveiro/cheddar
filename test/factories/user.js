/*eslint-disable no-unused-vars*/
import {Model, before} from '../../src/Cheddar'
/*eslint-enable no-unused-vars*/

export class User extends Model {

  constructor(properties = {}) {
    let defaults = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678'
    }
    super(Object.assign(defaults, properties))
  }

  @before('save')
  validate () {
    this.ensure('age', { type: Number })
    this.ensure('name', { type: String, required: true })
    this.ensure('email', { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }
}
