# `@reggi/journey`

```
npm i @reggi/journey
```

## Why

`journey` allows you to design a functional flow, it is a reducer for functions with the goal of storing all values along the way into one big object, but sill allowing for a returnable value

```js
const {journey} = require('@reggi/journey')

const cleanGreeting = (greeting) => (greeting === 'hi') ? 'Hello' : greeting

const helloWorld = journey((greeting, name) => [
  () => ({greeting, name}), // put greeting and name into the object to use
  ({greeting}) => ({cleanGreeting: cleanGreeting(greeting)}), // here we create a new property and return it it gets added to the object,
  ({cleanGreeting, name}) => ({message: `${cleanGreeting} ${name}`}) // here we have access to `name` and `cleanGreeting`, all we need
])

// Here we can call this function and get the entire function back

console.log(helloWorld('hi', 'Thomas')) // => {greeting: 'hi', name: 'Thomas', cleanGreeting: 'Hello', message: 'Hello Thomas'}
```

Now if we only wanted `message` to be returned, we would do this:

```js
const {journey} = require('@reggi/journey')

const cleanGreeting = (greeting) => (greeting === 'hi') ? 'Hello' : greeting

const helloWorld = journey((greeting, name) => [
  () => ({greeting, name}), // put greeting and name into the object to use
  ({greeting}) => ({cleanGreeting: cleanGreeting(greeting)}), // here we create a new property and return it it gets added to the object,
  ({cleanGreeting, name}) => ({message: `${cleanGreeting} ${name}`}) // here we have access to `name` and `cleanGreeting`, all we need
], {return: 'message'})

// Here we can call this function and get just `message` back

console.log(helloWorld('hi', 'Thomas')) // => 'Hello Thomas'

// But journey also provides us another function, if we call `.journey` we get the entire object back again, even though we added `{return: message}`.

console.log(helloWorld.journey('hi', 'Thomas')) // => {greeting: 'hi', name: 'Thomas', cleanGreeting: 'Hello', message: 'Hello Thomas'}
```

As you can see all variables declared in the flow are accessable at the end of the function. This is very valuable, because nothing is lost, and everything is accessable.

# Options

The second paramater here is objects that change the essential flow. 

## `hook`

```js
const {journey} = require('@reggi/journey')

const cleanGreeting = (greeting) => (greeting === 'hi') ? 'Hello' : greeting

const helloWorld = journey((greeting, name) => [
  () => ({greeting, name}), // put greeting and name into the object to use
  ({greeting}) => ({cleanGreeting: cleanGreeting(greeting)}), // here we create a new property and return it it gets added to the object,
  ({cleanGreeting, name}) => ({message: `${cleanGreeting} ${name}`}) // here we have access to `name` and `cleanGreeting`, all we need
], {hook: (acq, result) => console.log(result)})

console.log(helloWorld('hi', 'Thomas'))

// { greeting: 'hi', name: 'Thomas' }
// { cleanGreeting: 'Hello' }
// { message: 'Hello Thomas' }
// { greeting: 'hi',
//   name: 'Thomas',
//   cleanGreeting: 'Hello',
//   message: 'Hello Thomas' }
```

This will allow us to log each step allong the way.
