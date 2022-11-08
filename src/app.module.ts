import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoffeesController } from './coffees/coffees.controller'
import { CoffeesService } from './coffees/coffees.service'
import { CoffeesModule } from './coffees/coffees.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-server',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'iluvcoffee',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoffeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
