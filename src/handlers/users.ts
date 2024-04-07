// HANDLER FUNCTIONS FOR THE USERS ROUTES

import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { User } from "../types/response";

export function getUsers(request: Request, response: Response) {
    response.send([])
}

export function getUserById(request: Request<{id: string}, {}, {}, {}>, response: Response) {
  console.log(request.params.id)
  response.send({});
}

// Request<{ReqParams}, {ResBody}, {ReqBody}, {QueryParams}> 
// Response<{ResBody}, {LocalsObj}, StatusCode>
// Example POST Request: localhost:3000/api/users?loginAfterCreate=false
export function createUser(request: Request<{}, {}, CreateUserDto, CreateUserQueryParams>, response: Response<User, {}, 201>) {
    console.log(request.query.loginAfterCreate)
    return response.status(201).send({
      id: 3,
      email: "lexluthor@gmail.com",
      username: "leX"
    })
}