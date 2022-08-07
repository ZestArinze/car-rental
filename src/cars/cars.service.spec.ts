import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { typeormPartialMock } from '../common/utils/test.utils';
import { Seller } from '../sellers/entities/seller.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Brand } from './entities/brand.entity';
import { CarCategory } from './entities/car-category.entity';
import { Car } from './entities/car.entity';
import { CarBrand, Category } from './enums';

describe('CarsService', () => {
  let service: CarsService;

  const seller = {
    id: 4,
    email: 'lucy@example.com',
    address: '123 Main Street',
  };

  const brand = {
    id: 5,
    name: CarBrand.BMW,
  };

  const category = {
    id: 6,
    name: Category.Truck,
  };

  const carData: CreateCarDto = {
    brand_id: brand.id,
    car_category_id: category.id,
    seller_id: seller.id,
    mileage: 12000 * 5,
    year: '2017',
    price: 2000000,

    name: 'Honda Accord',
    engine_type: '4-Cylinder(I4)',
    transmission: 'Automatice',
    fuel_type: 'Petrol',
    interior_color: 'Grey',
    exterior_color: 'Dark Grey',
    vehicle_number: 'ABJ060374',
  };

  const carRepoMock = {
    ...typeormPartialMock,

    create: jest.fn().mockImplementation((dto) => {
      return dto;
    }),

    save: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ ...dto, id: Date.now(), vehicle_id: 'abcd' });
    }),

    getOne: jest.fn().mockImplementation((id: number) => ({
      ...carData,
      id: id,
      users: [seller],
    })),

    findOne: jest.fn().mockReturnValue({
      ...carData,
      id: Date.now(),
      users: [seller],
    }),

    getMany: jest.fn().mockReturnValue([{ ...carData, users: [seller] }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        UsersService,
        {
          provide: getRepositoryToken(Car),
          useValue: carRepoMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: jest.fn().mockReturnThis(),
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create car', async () => {
    const result = await service.create(carData);

    console.log({ result });

    expect(result).toMatchObject({
      id: expect.any(Number),
      vehicle_id: expect.any(String),

      brand_id: brand.id,
      car_category_id: category.id,
      seller_id: seller.id,

      mileage: carData.mileage,
      year: carData.year,
      price: carData.price,
      vehicle_number: carData.vehicle_number,
    });
  });
});
