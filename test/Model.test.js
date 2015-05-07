/*eslint-disable no-unused-vars*/
import {Model, Cheddar, before} from '../src/Cheddar'
/*eslint-enable no-unused-vars*/
import {assert} from 'chai'

Cheddar.database = 'localhost/cheddar-test'

class TestModel extends Model {
  @before('save')
  validate () {
    this.ensure('age', { type: Number })
    this.ensure('name', { type: String, required: true })
    this.ensure('email', { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }
}

describe('ApplicationModel', () => {
  let model

  beforeEach(() => {
    model = new TestModel()
  })

  afterEach(async function () {
    await model.delete()
  })

  describe('constructor', () => {
    it('returns a new instance', () => {
      assert.isTrue(model instanceof TestModel)
      assert.property(model, 'id')
    })
  })

  describe('*save', () => {
    it('save model on db', async function () {
      let count = await TestModel.count()
      assert.equal(count, 0)

      model.name = 'Test'
      model.email = 'test@test.com'
      model.password = '123456'
      await model.save()

      count = await TestModel.count()
      assert.equal(count, 1)
    })
  })

  describe('save middleware', () => {
    it('fails if missing property', async function () {
      try {
        model.name = 'Test'
        await model.save()
      } catch (error) {
        assert.equal(error.message, 'email is missing.')
      }
    })

    it('fails if unexpected type', async function () {
      try {
        model.name = 'Test'
        model.age = '42'
        await model.save()
      } catch (error) {
        assert.equal(error.message, 'age is not a Number.')
      }
    })

    it('save model if validation is ok', async function () {
      model.name = 'Test'
      model.email = 'test@test.com'
      model.password = '123456'
      await model.save()
    })
  })
})
