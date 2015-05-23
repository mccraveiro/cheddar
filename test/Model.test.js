import {Cheddar} from '../src/Cheddar'
import {Factory} from './Factory'
import {User} from './factories/user'
import {assert} from 'chai'
import 'mochawait'

Cheddar.database = 'localhost/cheddar-test'

describe('ApplicationModel', () => {
  afterEach(async function () {
    await User.remove()
  })

  describe('constructor', () => {
    it('returns a new instance', async function () {
      let model = await Factory.create('User')
      assert.instanceOf(model, User)
      assert.property(model, 'id')
    })
  })

  describe('count', () => {
    it('increase count after creating model', async function () {
      assert.equal(await User.count(), 0)
      await Factory.create('User')
      assert.equal(await User.count(), 1)
    })
  })

  describe('find', () => {
    it('returns empty array', async function () {
      let models = await User.find()
      assert(Array.isArray(models))
      assert.lengthOf(models, 0)
    })

    it('returns array of models', async function () {
      await Factory.createList('User', 3)
      let models = await User.find()
      assert(Array.isArray(models))
      assert.lengthOf(models, 3)
    })
  })

  describe('save middleware', () => {
    it('fails if missing property', async function () {
      try {
        await Factory.create('User', { email: undefined })
        throw new Error('Middleware failed')
      } catch (error) {
        assert.equal(error.message, 'email is missing.')
      }
    })

    it('fails if unexpected type', async function () {
      try {
        await Factory.create('User', { age: '42' })
        throw new Error('Middleware failed')
      } catch (error) {
        assert.equal(error.message, 'age is not a Number.')
      }
    })
  })
})
