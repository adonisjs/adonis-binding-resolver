'use strict'

const fold = require('adonis-fold')
const test = require('japa')
const Resolver = require('../src/Resolver')
const resolverManager = require('../index')

test.group('Resolver', (group) => {
  group.beforeEach(() => {
    fold.Ioc._bindings = {}
  })

  test('throw exception when directories are not defined', (assert) => {
    const resolver = () => new Resolver()
    assert.throw(resolver, 'Cannot initiate resolver without registering directories')
  })

  test('throw exception when namespace is not defined', (assert) => {
    const directories = {
      views: 'Views'
    }
    const resolver = () => new Resolver(directories)
    assert.throw(resolver, 'Cannot initiate resolver without registering appNamespace')
  })

  test('register directories hash', (assert) => {
    const directories = {
      views: 'Views'
    }
    const resolver = new Resolver(directories, 'App')
    assert.deepEqual(resolver._directories, directories)
  })

  test('register app namespace', (assert) => {
    const resolver = new Resolver({}, 'App')
    assert.deepEqual(resolver._appNamespace, 'App')
  })

  test('make path to a provider', (assert) => {
    const resolver = new Resolver({}, 'App')
    assert.equal(resolver.translate('Adonis/Src/Server'), 'Adonis/Src/Server')
  })

  test('make path to app namespace', (assert) => {
    const resolver = new Resolver({}, 'App')
    assert.equal(resolver.translate('App/Controllers/FooController'), 'App/Controllers/FooController')
  })

  test('make path for pre-registered directory', (assert) => {
    const resolver = new Resolver({
      httpControllers: 'Controllers'
    }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('FooController'), 'App/Controllers/FooController')
  })

  test('throw exception when directory is not pre-registered', (assert) => {
    const resolver = new Resolver({
      httpControllers: 'Controllers'
    }, 'App', fold, 'wsControllers')

    const fn = () => resolver.translate('FooController')
    assert.throw(fn, 'Cannot translate binding, since wsControllers is not registered under directories')
  })

  test('make sure path is normalized', (assert) => {
    const resolver = new Resolver({
      httpControllers: 'Controllers'
    }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('/FooController'), 'App/Controllers/FooController')
  })

  test('remove ending /', (assert) => {
    const resolver = new Resolver({
      httpControllers: 'Controllers'
    }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('FooController/'), 'App/Controllers/FooController')
  })

  test('remove starting /', (assert) => {
    const resolver = new Resolver({
      httpControllers: 'Controllers'
    }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('/App/Controllers/FooController'), 'App/Controllers/FooController')
  })

  test('identify complete namespace and return as it is', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('App/Controllers/FooController'), 'App/Controllers/FooController')
    assert.equal(resolver.translate('App/Controllers/FooController/App/Controllers'), 'App/Controllers/FooController/App/Controllers')
  })

  test('force binding to be proivder', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold, 'httpControllers')
    assert.equal(resolver.translate('@provider:Adonis/FooController'), 'Adonis/FooController')
  })

  test('resolve binding when input is a function', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    const fn = function () {}
    assert.deepEqual(resolver.resolveFunc(fn), {instance: null, isClosure: true, method: fn})
  })

  test('resolve binding via IoC container', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    class FooClass {}
    const fooInstance = new FooClass()
    fold.Ioc.bind('Adonis/Src/Foo', function () {
      return fooInstance
    })
    assert.deepEqual(resolver.resolve('Adonis/Src/Foo'), fooInstance)
  })

  test('resolve binding with method expression via IoC container', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    class FooClass {
      bar () {}
    }
    const fooInstance = new FooClass()
    fold.Ioc.bind('Adonis/Src/Foo', function () {
      return fooInstance
    })
    assert.deepEqual(resolver.resolveFunc('Adonis/Src/Foo.bar'), {instance: fooInstance, isClosure: false, method: fooInstance.bar})
  })

  test('throw exception when method does not exists', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    class FooClass {
    }
    const fooInstance = new FooClass()
    fold.Ioc.bind('Adonis/Src/Foo', function () {
      return fooInstance
    })
    const fn = () => resolver.resolveFunc('Adonis/Src/Foo')
    assert.throw(fn, 'E_INVALID_MAKE_STRING: Ioc.makeFunc expects a string in module.method format instead received Adonis/Src/Foo')
  })

  test('throw exception when invalid binding format', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    class FooClass {
    }
    const fooInstance = new FooClass()
    fold.Ioc.bind('Adonis/Src/Foo', function () {
      return fooInstance
    })
    const fn = () => resolver.resolveFunc('Adonis/Src/Foo.bar.baz')
    assert.throw(fn, 'E_INVALID_MAKE_STRING: Ioc.makeFunc expects a string in module.method format instead received Adonis/Src/Foo.bar.baz')
  })

  test('skip dots by escaping them', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    class FooClass {
      bar () {}
    }
    const fooInstance = new FooClass()
    fold.Ioc.bind('Adonis/Src.Foo', function () {
      return fooInstance
    })
    assert.deepEqual(resolver.resolveFunc('Adonis/Src\\.Foo.bar'), {instance: fooInstance, isClosure: false, method: fooInstance.bar})
  })

  test('throw exception when binding is not a string, neither a callback', (assert) => {
    const resolver = new Resolver({ httpControllers: 'Controllers' }, 'App', fold)
    const fn = () => resolver.resolveFunc({})
    assert.throw(fn, 'Cannot translate object, binding should always be a valid string.')
  })
})

test.group('Resolver Manager', () => {
  test('normalize binding', (assert) => {
    resolverManager.appNamespace('App')
    assert.equal(resolverManager.translate('Adonis//Src/Foo'), 'Adonis/Src/Foo')
  })

  test('make binding for a given directory', (assert) => {
    resolverManager.directories({ httpControllers: 'Controllers' })
    resolverManager.appNamespace('App')
    assert.equal(resolverManager.forDir('httpControllers').translate('User'), 'App/Controllers/User')
  })
})
