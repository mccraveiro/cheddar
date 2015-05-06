import {Model, Cheddar} from '../src/Cheddar'
import {expect} from 'chai'

Cheddar.database = 'localhost/cheddar-test'

class TestModel extends Model {
  configure () {
    this.before('save', this.validate)
  }

  validate () {
    this.ensure('age',      { type: Number })
    this.ensure('name',     { type: String, required: true })
    this.ensure('email',    { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }
}

describe('ApplicationModel', () => {
  let model

  beforeEach(() => {
    model = new TestModel()
  })

  afterEach(function*() {
    yield model.delete()
  })

  describe('constructor', () => {
    it('returns a new instance', () => {
      expect(model instanceof TestModel).to.be.true
      expect(model.id).to.exist
    })
  })

  describe('*save', () => {
    it('save model on db', function *() {
      let count = yield TestModel.count()
      expect(count).to.be.equal(0)

      model.name = 'Test'
      model.email = 'test@test.com'
      model.password = '123456'
      yield model.save()

      count = yield TestModel.count()
      expect(count).to.be.equal(1)
    })
  })

  describe('save middleware', () => {
    it('fails if missing property', function *() {
      try {
        model.name = 'Test'
        yield model.save()
      } catch (error) {
        expect(error.message).to.be.equal('email is missing.')
      }
    })

    it('fails if unexpected type', function *() {
      try {
        model.name = 'Test'
        model.age = '42'
        yield model.save()
      } catch (error) {
        expect(error.message).to.be.equal('age is not a Number.')
      }
    })

    it('save model if validation is ok', function *() {
      model.name = 'Test'
      model.email = 'test@test.com'
      model.password = '123456'
      yield model.save()
    })
  })
})
