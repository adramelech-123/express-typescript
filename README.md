# EXPRESS WITH TYPESCRIPT

## 1. SETUP

We will need to install the following packages to get express working with typescript:

### Express and Typescript Installation

```bash
# Dependencies
npm i express
npm i express-session

# Developer dependencies
npm i -D typescript 
npm i -D @types/express #Install type definitions for express
npm i -D @types/express-session # Install Type definitions for express-session
npm i -D nodemon
npm i -D ts-node # A ts interpreter to enable us to run scripts on ts files e.g "nodemon ./src/index.ts"
```

### TSConfig

Use local tsc binary in the node_modules by running `npx tsc --init` in the terminal to generate a `tsconfig.json` file. Open the tsconfig file and change the following options:

```json
/* Modules */ 
"rootDir": "./src"   //Specify Root Directory
/* Emit */ 
"outDir": "./dist",  
/* Type Checking */
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
```

Run the command `npx tsc --build` to generate (transpile ts to js) the output directory for the compiled `index.js` file. Now we need to setup some scripts in the `package.json` to allow us to run continous development and watch for file changes:

```json
 "scripts": {
    "build": "tsc --build", //Transpile TS to JS code
    "start": "node ./dist/index.js", 
    "start:dev": "nodemon ./src/index.ts" // Watch for file changes
  },
```

## 2. Setup Express App

Now in the `index.ts` file we can go ahead and setup our express application:

```ts
import express, { NextFunction, Request, Response } from 'express-serve-static-core'

const app = express()
const PORT = 3000

app.use('/api/users', usersRouter)

app.listen(PORT, () => {
    console.log(`Express with Typescript runinng on PORT ${PORT} 👍!`)
})

app.get('/api/test', (request: Request, response: Response, next: NextFunction) => {
    response.send(['test', 'route'])
})
```
We can type annotate the request and response with the `Request` and `Response` Types from the `express-serve-static-core package`. The next function can also be annotated with the `NextFunction` type.

## 3. Routes

We are going to create a `users` route by creating a `routes` folder and creating a `users.ts` file as follows:

```ts
import { Router } from "express";
import { getUsers, getUserById } from "../handlers/users";

const router = Router()

// '/api/users'route since we defined that in the index.ts
router.get('/', getUsers )

// api/users/:id
router.get('/:id', getUserById)

//  '/api/users'
router.post('/', createUser)

export default router
```
This time we will use named functions as handler functions in our routes for example `router.get('/', getUsers)`. We created a separate folder for handler functions for which we will import in the `users.ts` route. Below is the code in the handler file for the users route:

```ts
// HANDLER FUNCTIONS STRUCTURE FOR THE USERS ROUTES

import { Request, Response } from "express-serve-static-core";

export function getUsers(request: Request, response: Response) {
    //Code 
}

export function getUserById(request: Request, response: Response) {
    //Code
}

export function createUser(request: Request, response: Response) {
    //Code
}

```

### Type Annotating the Request Body
The Request and Response Types can be expressed as Generics which take in object parameters as follows:

1. Request<{ReqParams}, {ResBody}, {ReqBody}, {QueryParams}>
2. Response<{ResBody}, {LocalsObj}, StatusCode>

Not all parameters have to be entered, but it would be useful to have these defined in our application for robust type safety. We can implement as follows in our request handlers: 

```ts
import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { User } from "../types/response";

export function getUserById(request: Request<{id: string}, {}, {}, {}>, response: Response) {
  console.log(request.params.id)
  response.send({});
}

// Example POST Request: localhost:3000/api/users?loginAfterCreate=false
export function createUser(request: Request<{}, {}, CreateUserDto, CreateUserQueryParams>, response: Response<User, {}, 201>) {
    console.log(request.query.loginAfterCreate)
    return response.status(201).send({
      id: 3,
      email: "lexluthor@gmail.com",
      username: "leX"
    })
}
```

For the `getUserById` request handler, we have defined the request params object so that we ensure we are making the correct request with the correct params in the route. For example `api/users/:id`, this will make sure we get the `id` param when we make a get request for a specific user.

For the `createUser` request handler, we have defined the RequestBody and the QueryParams of our request, by defining them in separate files as follows:

1. `CreateUserDto` - This is the structure of the data we want to pass in the request body

    ```ts
    export interface CreateUserDto {
        username: string,
        email: string,
        password: string
    }
    ```

2. `CreateUserQueryParams` - This defines the optinal parameters that might be passed in the request. This is in the `query-params.ts` file.
   
   ```ts
    export interface CreateUserQueryParams {
        loginAfterCreate?: boolean
    }
   ```
We have also defined what we expect from the response by defining the structure of the Response Body for Users as follows:

```ts
export interface User {
    id: number,
    email: string,
    username: string
}
```

Therefore when we make a post request to create a new user, we expect it to return user data with the id, email and username as defined above.


## 4. Extending the Request Interface

We can add custom properties to the Request Interface through `declaration merging`. Declaration merging allows us to create our own file and merge our custom declarations with existing types. So essentially we can expand our Request interface in the `express-serve-static-core` package.

First we create an `index.d.ts` file to put our type definitions.

```ts
import * as express from 'express-serve-static-core'

declare global {
    namespace Express {
      interface Request {
        customField?: string;
      }
    }
}
```

Now the customField is available globally as a type in our Request interface.
Whenever we install type definitions for other packages e.g. `express-session`, the same extension to Request, Response interfaces, etc happens due to the installation of types that come with the packages.