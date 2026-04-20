import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { YelnurException } from '../common/exceptions/yelnur.exception';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get('excep')
  checkExcept() {
    throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('custom-excep')
  checkCustomExcept() {
    throw new HttpException(
      {
        message: 'This is a custom message',
        status: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  @Get('YelnurException')
  checkYelnur() {
    throw new YelnurException();
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    throw new ForbiddenException();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Post('postus')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  postus(@Body() createCatDto: CreateCatDto) {
    return {
      ...createCatDto,
      date: Date.now(),
    };
  }
}