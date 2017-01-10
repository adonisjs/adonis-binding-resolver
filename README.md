<p align="center">
  <a href="http://adonisjs.com"><img src="https://cloud.githubusercontent.com/assets/2793951/21800144/8fdcdef6-d71c-11e6-9463-51f5be126faa.png" alt="AdonisJs Binding Resolver"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/adonis-binding-resolver"><img src="https://img.shields.io/npm/v/adonis-binding-resolver.svg?style=flat-square" alt="Version"></a>
  <a href="https://travis-ci.org/adonisjs/adonis-binding-resolver"><img src="https://img.shields.io/travis/adonisjs/adonis-binding-resolver/master.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://coveralls.io/github/adonisjs/adonis-binding-resolver?branch=master"><img src="https://img.shields.io/coveralls/adonisjs/adonis-binding-resolver/master.svg?style=flat-square" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/adonis-binding-resolver"><img src="https://img.shields.io/npm/dt/adonis-binding-resolver.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/adonis-binding-resolver.svg?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="https://gitter.im/adonisjs/adonis-framework"><img src="https://img.shields.io/badge/gitter-join%20us-1DCE73.svg?style=flat-square" alt="Gitter"></a>
  <a href="https://trello.com/b/yzpqCgdl/adonis-for-humans"><img src="https://img.shields.io/badge/trello-roadmap-89609E.svg?style=flat-square" alt="Trello"></a>
  <a href="https://www.patreon.com/adonisframework"><img src="https://img.shields.io/badge/patreon-support%20AdonisJs-brightgreen.svg?style=flat-square" alt="Support AdonisJs"></a>
</p>

<br>

AdonisJs Binding Resolver is a thin module to validate, resolve and execute bindings attached as a closure or IoC Container binding.

It is used by the following packages:

* [adonis-framework](https://github.com/adonisjs/adonis-framework)
* [adonis-lucid](https://github.com/adonisjs/adonis-lucid)
* [adonis-redis](https://github.com/adonisjs/adonis-redis)

You can learn more about AdonisJs and all of its awesomeness on http://adonisjs.com :rocket:

<br>
<hr>
<br>

## Examples

A route handler can point to `closure` or reference to controller method.

```javascript
Route.get('/', function * (request, response) {
  // ...
})

// or

Route.get('/', 'HomeController.index')
```

Now manually parsing the 2nd argument can become a little gross as you have to take care of following things.

1. Validate the argument to make sure it is a function or a string only.
2. If 2nd argument is a function, make sure to execute it as a function.
3. If it is a string, parse the string and fetch the right module and function of the string.
4. Also make sure that string argument method has correct reference to the scope `this`.

This module takes care of all this for you.

### Validate Binding
```javascript
const Resolver = require('adonis-binding-resolver')
const Ioc = require('adonis-fold').Ioc
const resolver = new Resolver(Ioc)

resolver.validateBinding('App/Http/Controllers/HomeController.index') // works fine
resolver.validateBinding(function () {}) // works fine
resolver.validateBinding(null) // throws exception
resolver.validateBinding({}) // throws exception
resolver.validateBinding('') // throws exception
resolver.validateBinding('App/Http/Controllers/HomeController') // throws exception, since method is not defined
```


### Resolve Binding
```javascript
const Resolver = require('adonis-binding-resolver')
const Ioc = require('adonis-fold').Ioc
const resolver = new Resolver(Ioc)

resolver.resolveBinding('App/Http/Controllers/HomeController.index') // returns {instance: HomeController, method: 'index'}

resolver.resolveBinding(function () {}) // returns function () {}
```

### Execute Binding

Executing binding will automatically resolve it for you. Just make sure to call `validatingBinding()` first.

```javascript
const Resolver = require('adonis-binding-resolver')
const Ioc = require('adonis-fold').Ioc
const resolver = new Resolver(Ioc)

resolver.validateBinding('App/Http/Controllers/HomeController.index') // make sure binding is fine

const result = resolver.executeBinding('App/Http/Controllers/HomeController.index')
console.log(result)
```


### Passing Data when executing

You can also pass data when executing a binding. Data is passed as an array, which is passed as multiple arguments to the resolved method using `apply` method.

```javascript
const request = {} // your http request
const response = {} // your http response
const result = resolver.executeBinding('App/Http/Controllers/HomeController.index', [request, response])
```

### Passing custom scope

At times you may want to override the current instance of a module/class and pass your own custom instance. Same can be done by passing 3rd argument to the `executeBinding` method.

```javascript
const modelInstance = {}
const result = resolver.executeBinding('App/Http/Model/Hooks/Password.encrypt', [], modelInstance)
```

<br>
## Contribution Guidelines

In favor of active development we accept contributions from everyone. You can contribute by submitting a bug, creating pull requests or even improving documentation.

You can find a complete guide to be followed strictly before submitting your pull requests in the [Official Documentation](http://adonisjs.com/docs/contributing).
