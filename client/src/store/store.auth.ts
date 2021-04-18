import { makeAuthPlugin } from '../boot/feathers-client'

export default makeAuthPlugin({ userService: 'users'})
