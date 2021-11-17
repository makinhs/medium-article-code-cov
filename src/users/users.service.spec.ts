import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { closeInMongodConnection, rootMongooseTestModule } from '../helpers/mongoose.mocks';
import { MongooseModule } from '@nestjs/mongoose';
import * as faker from 'faker';
import { first } from 'rxjs';

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const updatedLastName = faker.name.lastName();
const email = faker.internet.email();
let id = '';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create an user', async () => {
    const user = await service.create({ firstName, lastName, email });
    expect(user).toBeDefined();
    id = user._id.toString();
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
    expect(user.email).toBe(email);
  });

  it('Should get the user by id', async () => {
    const user = await service.findOne(id);
    expect(user.firstName).toBe(firstName);
  });

  it('Should update lastName', async () => {
    const updatedUser = await service.update(id, { firstName, lastName: updatedLastName, email });
    expect(updatedUser.lastName).toBe(updatedLastName);
  });

  it('Should list all users', async () => {
    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
  });

  it('Should delete an user', async () => {
    await service.remove(id);
    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(users.length).toBe(0);
  });

  it('Should not find an user', async () => {
    try {
      await service.findOne('Non_valid_id');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
  it('Should fail trying to update a non existing user', async () => {
    try {
      await service.update('Non_valid_id', { firstName, lastName: updatedLastName, email });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
