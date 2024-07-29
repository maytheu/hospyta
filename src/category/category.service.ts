import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async getCategory() {
    return await this.categoryModel.find({}, 'name');
  }

  async newCategory(name: string) {
    return await this.categoryModel.create({ name });
  }
}
