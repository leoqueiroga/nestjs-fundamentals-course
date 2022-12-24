import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CoffeesService } from './coffees.service'
import { Coffee } from './entities/coffee.entity'
import { Flavor } from './entities/flavor.entity'

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})

describe('CoffeesService', () => {
  let service: CoffeesService
  let coffeesRepository: MockRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<CoffeesService>(CoffeesService)
    coffeesRepository = module.get<MockRepository>(getRepositoryToken(Coffee))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    describe('coffee with this id exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = 1
        const expectedCoffee = {}

        coffeesRepository.findOne.mockResolvedValue(expectedCoffee)
        const coffee = await service.findOne(coffeeId)
        expect(coffee).toEqual(expectedCoffee)
      })
    })

    describe('coffee with this id does not exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = 1
        coffeesRepository.findOne.mockResolvedValue(null)
        try {
          await service.findOne(coffeeId)
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException)
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`)
        }
      })
    })
  })
})
