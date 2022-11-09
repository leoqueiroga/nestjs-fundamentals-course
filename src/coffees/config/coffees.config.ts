import { registerAs } from '@nestjs/config'

export default registerAs('coffees', () => ({
  foo: process.env.COFFEE_FOO,
}))
