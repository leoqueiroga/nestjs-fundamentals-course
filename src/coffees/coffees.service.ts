import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { CreateCoffeeDto } from './dto/create-coffee.dto'
import { UpdateCoffeeDto } from './dto/update-coffee.dto'
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity'
import { Event } from '../events/entities/event.entity'
import { COFFEE_BRANDS } from './coffees.constants'
import { ConfigService, ConfigType } from '@nestjs/config'
import coffeesConfig from './config/coffees.config'

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
    private readonly dataSource: DataSource
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery
    return await this.coffeesRepository.find({
      relations: {
        flavors: true,
      },
      skip: offset,
      take: limit,
    })
  }

  async findOne(id: number) {
    const coffee = await this.coffeesRepository.findOne({
      where: { id },
      relations: { flavors: true },
    })
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`)
    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name))
    )
    const coffee = this.coffeesRepository.create({
      ...createCoffeeDto,
      flavors,
    })
    return await this.coffeesRepository.save(coffee)
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name))
      ))
    const coffee = await this.coffeesRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    })
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`)
    return await this.coffeesRepository.save(coffee)
  }

  async remove(id: number) {
    const coffee = await this.findOne(id)
    return await this.coffeesRepository.remove(coffee)
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorsRepository.findOne({
      where: { name },
    })
    if (existingFlavor) return existingFlavor
    return this.flavorsRepository.create({ name })
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      coffee.recommendations++

      const recommendEvent = new Event()
      recommendEvent.name = 'recommend_coffee'
      recommendEvent.type = 'coffee'
      recommendEvent.payload = { coffeeId: coffee.id }

      await queryRunner.manager.save(coffee)
      await queryRunner.manager.save(recommendEvent)

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }
  }
}
