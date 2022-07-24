# Prisma SDL

[![npm version](https://badge.fury.io/js/prisma-sdl.svg)](https://badge.fury.io/js/prisma-sdl)

## Features

- TypeScript friendly
- Great for quickly prototyping!
- Use as little or as much as you want, all of the generated modules are exported individually
- Tree-shakeable
- Supports custom tsconfig files for client and server compiling
- Supports one or multiple Prisma schemas
- Generates the following from a [Prisma](https://www.prisma.io/) schema file
  - [Apollo](https://www.apollographql.com/docs/react/api/react/hooks/) React Hooks
  - GraphQL SDL TypeDefs
  - GraphQL Resolvers
  - GraphQL Context
  - Client side GQL types
- Generates hooks, SDLs, and resolvers ready for:
  - Querying all data from each model
  - Querying a single model by primary key
  - Mutating an array of items from each model

## Usage

### Installing

```js
  // npm
  npm install -D prisma-sdl
  // yarn
  yarn add -D prisma-sdl
```

### Using the generator
#### Create a script file to run the generators
```ts
// generate.js
import { prismaSdl } from 'prisma-sdl'

const files = prismaSdl({ dest: 'sdl' })
```

#### Run the bin script

`npx prisma-sdl root="./" dest="sdl" header="// Autogenerated" fileTypes="ts, js, d.ts"`

### Server implementation

```ts
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers, context } from './sdl/server'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
})
// other node server code
```

### Client implementation

```ts
import React from 'react'
import { useBar, useFoos, useEditFooBars } from './sdl/client'

export default function App() {
  const bar = useBar({ variables: { id: 1 } })
  const foos = useFoos()
  const [submit, editFooBars] = useEditFooBars()

  const handleClick = () => {
    // incoming is a universal array that is typed to the model
    // deleting is a boolean, if false the records are upserted, otherwise deleted
    // if upserted, the new records with IDs are returned, if deleted, the IDs that were deleted are returned
    submit({
      variables: {
        incoming: [{ name: 'fooBar2' }, { name: 'fooBar3' }],
        deleting: false,
      },
    })
  }

  if (bar.loading || foos.loading || editFooBars.loading) {
    return <div>Loading...</div>
  }

  console.log(editFooBars.data?.editFooBars)
  // undefined until the button is clicked
  // [{ name: 'fooBar2' }, { name: 'fooBar3' }]

  return (
    <div>
      <h1>{bar.data?.bar.name}</h1>
      <ul>
        {foos.data?.foos.map((foo) => (
          <li key={foo.id}>{foo.name}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Edit Foo Bars</button>
    </div>
  )
}
```

## Optional

If you're using multiple Prisma schema files you can provide Prisma SDL with a name by adding a property to your schema file:

```bash
generator client {
  provider     = "prisma-client-js"
  output       = "../../../node_modules/@prisma/client"
  sdlGenerator = "example"
}
```

If any of your models have a DateTime or Json type, you will need to add the GraphQL Scalars package
```js
  // npm
  npm install graphql-scalars
  // yarn
  yarn add graphql-scalars
```

## Config

```ts
interface Options {
  root?: string // process.cwd()
  dest?: string // Options['root']
  header?: string // '// Automatically generated by Prisma SDL\n'
  fileTypes?: ['ts', 'js', 'd.ts'] // ['js', 'd.ts']
  tscClient?: string // ''
  tscServer?: string // ''
}
```

- `root`: The root directory to start searching for Prisma schemas
- `dest`: The directory to write the generated files to. If you set it to `''`, files will not be saved
- `header`: The header to prepend to each file.
- `fileTypes`: Which file types you want returned. Defaults to js and d.ts but you can add native .ts files if you'd like or only return .js if you don't want type definitions.
- `tscClient`: The name of the tsconfig.json file that you want the TS compiler to compile the client side code with, leaving it blank uses the default templates
- `tscServer`: The name of the tsconfig.json file that you want the TS compiler to compile the server side code with, leaving it blank uses the default templates

## Generated Structure

Respective exported names are commented for reference

```ts
.
├── client
│   ├── hooks
│   │   ├── mutations
│   │   │   ├── useEditFoos.ts // useEditFoos
│   │   │   ├── useEditBars.ts // useEditBars
│   │   │   └── index.ts
│   │   ├── queryOne
│   │   │   ├── useFoo.ts // useFoo
│   │   │   ├── useBar.ts // useBar
│   │   │   └── index.ts
│   │   └── queryAll
│   │       ├── useFoos.ts // useFoos
│   │       ├── useBars.ts // useBars
│   │       └── index.ts
│   ├── mutations
│   │   ├── EDIT_FOOS.ts // EDIT_FOOS
│   │   ├── EDIT_BARS.ts // EDIT_BARS
│   │   └── index.ts
│   ├── queryOne
│   │   ├── FOO.ts // FOO
│   │   ├── BAR.ts // BAR
│   │   └── index.ts
│   ├── queryAll
│   │   ├── FOOS.ts // FOOS
│   │   ├── BARS.ts // BARS
│   │   └── index.ts
│   └── index.ts
├── server
│   ├── context
│   │   ├── context.ts // context
│   │   └── index.ts
│   ├── resolvers
│   │   ├── resolvers.ts // resolvers
│   │   ├── mutations
│   │   │   ├── editFoos.ts // editFoos
│   │   │   ├── editBars.ts // editBars
│   │   │   └── index.ts
│   │   ├── queryOne
│   │   │   ├── foo.ts // foo
│   │   │   ├── bar.ts // bar
│   │   │   └── index.ts
│   │   └── queryAll
│   │       ├── foos.ts // foos
│   │       ├── bars.ts // bars
│   │       └── index.ts
│   └── typeDefs
│       ├── typeDefs.ts // typeDefs
│       ├── mutations
│       │   ├── FOOS_INPUT.ts // FOOS_INPUT
│       │   ├── BARS_INPUT.ts // BARS_INPUT
│       │   └── index.ts
│       └── queries
│           ├── FOO.ts // FOO
│           ├── BAR.ts // BAR
│           └── index.ts
└── types
    ├── foos.ts // GqlFoo, GqlQFoos, GqlMFoos, GqlFooVar
    ├── bars.ts // GqlBar, GqlQBars, GqlMBars, GqlBarVar
    └── index.ts
```
