import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/createDogDto';

export type Dog = {
  name: string;
  age: number;
  breed: string;
};

@Injectable()
export class DogsService {
  private readonly dogs: Dog[] = [];

  create(dto: CreateDogDto): Dog {
    const dog: Dog = {
      name: dto.name,
      age: dto.age,
      breed: dto.breed,
    };
    this.dogs.push(dog);
    return dog;
  }

  findAll(): Dog[] {
    return this.dogs;
  }
}