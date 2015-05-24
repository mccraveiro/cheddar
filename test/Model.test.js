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

    it('returns array of documents', async function () {
      await Factory.createList('User', 3)
      let documents = await User.find()
      assert.isArray(documents)
      assert.lengthOf(documents, 3)

      for (let i in documents) {
        assert.instanceOf(documents[i], User)
      }
    })
  })

  describe('findOne', () => {
    it('returns null', async function () {
      let model = await User.findOne()
      assert.isNull(model)
    })

    it('returns model object', async function () {
      await Factory.create('User')
      let model = await User.findOne()
      assert.isObject(model)
      assert.instanceOf(model, User)
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
