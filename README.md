# cheddar [![CircleCI](https://circleci.com/gh/mccraveiro/cheddar.svg?style=svg)](https://circleci.com/gh/mccraveiro/cheddar) [![Stories in Ready](https://badge.waffle.io/mccraveiro/cheddar.png?label=ready&title=Ready)](https://waffle.io/mccraveiro/cheddar)

ES6 Application framework

## Model definition

```javascript
import {Model, before} from 'Cheddar'

class User extends Model {
  @before('save')
  validate () {
    this.ensure('age', { type: Number })
    this.ensure('name', { type: String, required: true })
    this.ensure('email', { type: String, required: true })
    this.ensure('password', { type: String, required: true })
  }

  @after('save')
  log() {
    console.log(`User #${this.id} updated`)
  }
}
```
