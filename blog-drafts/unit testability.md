# Unit Testability

The only thing get in the way between your code and unit testable code is dependency management.

## What is dependency

Two types of dependencies:
Source Code Dependency and Runtime Dependency

```ts
import Foo from './Foo'
import Boo from './Boo'
import app from './app'
export class NotCool extends Foo {
  createBoo() {
    if (app.mode === 'production')
      return new Boo()
    else
      return new Boo(true)
  }
}
```

## Testability

Testability = inverting source code dependency while keeping runtime dependency

## Clean Architecture
