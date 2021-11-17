import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import * as faker from 'faker';

describe('UsersResolver', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    id: '',
  };
  const updatedLastName = faker.name.lastName();
  const fakeId = faker.datatype.uuid();
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(() => {
              return {
                _id: fakeId,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                updatedLastName: faker.name.lastName(),
              };
            }),
            findAll: jest.fn(() => {
              return [user];
            }),
            findOne: jest.fn(() => {
              return { ...user, _id: fakeId };
            }),
            update: jest.fn(() => {
              return { ...user, lastName: updatedLastName };
            }),
            remove: jest.fn(()=>{
              return '';
            })
          },
        }],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should create an user', async () => {
    const createdUser = await resolver.createUser(user);
    expect(createdUser._id).toBeDefined();
    user.id = createdUser._id;
  });

  it('Should find all users', async () => {
    const users = await resolver.findAll();
    expect(users.length).toBe(1);
  });

  it('Should find one user', async () => {
    const foundUser = await resolver.findOne(user.id);
    expect(foundUser._id).toBe(user.id);
  });

  it('Should update an user', async () => {
    const updatedUser = await resolver.updateUser({
      lastName: updatedLastName,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    });
    expect(updatedUser.lastName).toBe(updatedLastName);
  });

  it('Should delete the user', async ()=>{
    const deletedUser = await resolver.removeUser(user.id);
    expect(deletedUser).toBeDefined();
  })

});
