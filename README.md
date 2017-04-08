# Adonis Binding Resolver

This module is used internally or can be used when developing 3rd party addons for AdonisJs.

The purpose of the module is to offer a consistent interface to resolve IoC container bindings across the framework. For example:

A route can be register in one of the following ways.

```js
Route.get('/', async () => {

})

// or
Route.get('/', 'HomeController.render')
```

This is not only with routes, almost every part of AdonisJs allows users to bind plain callbacks or bind reference to IoC container via binding. Also some of the bindings can be typed partially.

Instead of saying `App/Controllers/HomeController` the user can say `HomeController`, since it is abvious that a controller is always saved inside `App/Controllers`.

To make all these checks, normalization easier, this module can be used.

## Translate

```js
const resolver = require('adonis-binding-resolver')
resolver.directories({
  httpControllers: 'Controllers'
})
resolve.use(require('adonis-fold'))

resolver.for('httpControllers').translate('HomeController')
// returns
// App/Controllers/HomeController
```

Also it will handle cases where user types the complete namespace.

```js
resolve.use(require('adonis-fold'))
resolver.for('httpControllers').translate('App/Controller/HomeController')
// returns
// App/Controllers/HomeController
```

**You will be thinking how does the resolve finds the `App` namespace?**

It pulls the namespace from the *Ioc container* passed via `use` method. 


## Resolve

The `translate` method job is to normalize and make the right namespace which can be resolved via the IoC container.

The `resolve` method takes a step further by resolving the binding object and also validates the referenced method. Take this example:

```js
Route.get('/', 'HomeController.index')
```

In order to resolve `HomeController.index` we need to call the `resolve` method.

```js
resolve.use(require('adonis-fold'))

const controller = resolver.for('httpControllers').resolveFunc('HomeController.index')
```

**Returns**

```js
{
  instance: HomeController,
  method: index,
  isClosure: false
}
```

Now it is as simple as calling the index method.

```js
controller.method.bind(controller.instance)()
```

Now let's say user passes a **Closure** instance of a string pointing towards a namespace

```js
const controller = resolver.for('httpControllers').resolveFunc(function () {})

// returns
// { instance: null, isClosure: true, method: function () {} }
```

## Validation

When resolving methods, the *Resolver* will validate to make sure that the methods does exists on a given object.

#### Missing Method

```
Method {index} missing on App/Controllers/HomeController
```
