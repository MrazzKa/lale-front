import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private cats: Cat[] = [
    { name: 'Erlin', age: 11, breed: 'ginger' },
    { name: 'Barsik', age: 5, breed: 'siamese' },
  ];

  findAll(): Cat[] {
    return this.cats;
  }

  create(createCatDto: CreateCatDto): Cat {
    const newCat: Cat = { ...createCatDto };
    this.cats.push(newCat);
    return newCat;
  }

  findOne(id: number): Cat {
    const needed = this.cats.find((cat) => cat.age === id);

    if (!needed) {
      throw new NotFoundException('Cat not found');
    }

    return needed;
  }
}