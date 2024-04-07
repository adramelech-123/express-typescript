import { Router } from "express";
import { getUsers, getUserById, createUser } from "../handlers/users";


const router = Router()


// '/' prefixes the '/api/users'route since we defined that in the index.ts
router.get('/', getUsers)

// '/api/users/:id'
router.get('/:id', getUserById)

//  '/api/users'

router.post('/', createUser)

export default router