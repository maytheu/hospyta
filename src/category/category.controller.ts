import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategory() {
    return this.categoryService.getCategory();
  }

  @Post('new')
  @UseGuards(AuthGuard)
  newCategory(@Body() categoryDto: CategoryDto) {
    return this.categoryService.newCategory(categoryDto.name);
  }
}
