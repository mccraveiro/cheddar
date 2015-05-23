/*eslint-disable no-unused-vars*/
import {Model, before} from '../../src/Cheddar'
/*eslint-enable no-unused-vars*/

export class User extends Model {

  constructor() {
    super()
    this.name = 'John Doe'
    this.email = 'john@example.com'
    this.password = '12345678'
  }

  @before('save')
  validate () {
    this.ensure('age', { type: Number })
    this.ensure('name', { type: String, required: true })
    this.ensure('email', { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }
}
