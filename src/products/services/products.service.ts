import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private brandService: BrandsService,
    private categoryService: CategoriesService,
  ) {}

  async findAll() {
    return await this.productRepo.find({
      relations: ['brand', 'categories'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      relations: ['brand', 'categories'],
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;
    const newProduct = this.productRepo.create(data);
    console.log('Create products');
    if (!data.brandId || !data.categoriesId) {
      throw new BadRequestException(
        `The brandId and categoriesId fields are required`,
      );
    }
    newProduct.brand = await this.brandService.findOne(data.brandId);
    newProduct.categories = await this.categoryService.findAll({
      where: {
        id: In(data.categoriesId),
      },
    });
    return await this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    const { brandId } = changes;
    this.productRepo.merge(product, changes);
    if (brandId) {
      product.brand = await this.brandService.findOne(brandId);
      return await this.productRepo.save(product);
    }
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this.productRepo.delete(id);
  }
}
