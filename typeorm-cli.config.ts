import { DataSource } from 'typeorm'
import { Coffee } from './src/coffees/entities/coffee.entity'
import { Flavor } from './src/coffees/entities/flavor.entity'
import { CoffeeRefactor1667875398904 } from './src/migrations/1667875398904-CoffeeRefactor'
import { SchemaSync1667876377954 } from './src/migrations/1667876377954-SchemaSync'

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'iluvcoffee',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1667875398904, SchemaSync1667876377954],
})
