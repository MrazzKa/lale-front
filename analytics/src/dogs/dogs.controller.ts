import { Body, Controller, Get, Post } from '@nestjs/common';
import { DogsService } from './dogs.service';
import type { Dog } from './dogs.service';
import { CreateDogDto } from './dto/createDogDto';

@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Post()
  create(@Body() dto: CreateDogDto): Dog {
    return this.dogsService.create(dto);
  }

  @Get()
  findAll(): Dog[] {
    return this.dogsService.findAll();
  }
}