import journey from './index'

test('to work sync', () => {
  const expectation = { name: 'Thomas', age: '29', namePlusAge: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({namePlusAge: name + age})
  ])
  expect(example('Thomas')).toEqual(expectation)
  expect(example.journey('Thomas')).toEqual(expectation)
})

test('to work async', () => {
  const expectation = { name: 'Thomas', age: '29', namePlusAge: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    async () => ({age: '29'}),
    ({name, age}) => ({namePlusAge: name + age})
  ])
  example('Thomas').then(results => {
    expect(results).toEqual(expectation)
  })
})

test('to work and return a prop', () => {
  const expectation = { name: 'Thomas', age: '29', namePlusAge: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({namePlusAge: name + age})
  ], {return: 'namePlusAge'})
  expect(example('Thomas')).toEqual(expectation.namePlusAge)
  expect(example.journey('Thomas')).toEqual(expectation)
})

test('to work with exports export prop as string', () => {
  const expectation = { name: 'Thomas', age: '29', namePlusAge: 'Thomas29' }
  const {namePlusAge} = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({namePlusAge: name + age})
  ], {exports: 'namePlusAge'})
  expect(namePlusAge('Thomas')).toEqual(expectation.namePlusAge)
  expect(namePlusAge.journey('Thomas')).toEqual(expectation)
})

test('to work with exports export prop as array', () => {
  const expectation = { name: 'Thomas', age: '29', namePlusAge: 'Thomas29' }
  const {namePlusAge, age} = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({namePlusAge: name + age})
  ], {exports: ['namePlusAge', 'age']})
  expect(namePlusAge('Thomas')).toEqual(expectation.namePlusAge)
  expect(namePlusAge.journey('Thomas')).toEqual(expectation)
  expect(age('Thomas')).toEqual(expectation.age)
  expect(age.journey('Thomas')).toEqual(expectation)
})

test('to work with return true', () => {
  const expectation = { name: 'Thomas', age: '29', return: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({return: name + age})
  ], {return: true})
  expect(example('Thomas')).toEqual(expectation.return)
  expect(example.journey('Thomas')).toEqual(expectation)
})

test('to work with async error', () => {
  const example = journey(() => [
    async () => ({meow: true}),
    async () => {
      throw new Error ('hello meow')
    },
    async () => ({woof: true})
  ])
  expect(example()).rejects.toThrow('hello meow')
})

test('to work with hook', () => {
  const expectation = { name: 'Thomas', age: '29', return: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({return: name + age})
  ], {hook: (acq, result) => {
    expect(acq).toBeTruthy()
    expect(result).toBeTruthy()
  }})
  expect(example('Thomas')).toEqual(expectation)
  expect(example.journey('Thomas')).toEqual(expectation)
})

test('to work with async hook', () => {
  const expectation = { name: 'Thomas', age: '29', return: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    async () => ({age: '29'}),
    ({name, age}) => ({return: name + age})
  ], {hook: async (acq, result) => {
    expect(acq).toBeTruthy()
    expect(result).toBeTruthy()
  }})
  expect(example('Thomas')).resolves.toEqual(expectation)
  expect(example.journey('Thomas')).resolves.toEqual(expectation)
})

test('to work with resolve function', () => {
  const expectation = { name: 'Thomas', age: '29', return: 'Thomas29' }
  const example = journey((name) => [
    () => ({name}),
    () => ({age: '29'}),
    ({name, age}) => ({return: name + age})
  ], (v) => v.age)
  expect(example('Thomas')).toEqual(expectation.age)
  expect(example.journey('Thomas')).toEqual(expectation)
})
