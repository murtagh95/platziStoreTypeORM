import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  async findAll() {
    return await this.brandRepo.find();
  }

  async findOne(id: number) {
    const brand = this.brandRepo.findOne({
      relations: ['products'],
      where: {
        id: id,
      },
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    const newBrand = await this.brandRepo.create(data);
    return await this.brandRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    this.brandRepo.merge(brand, changes);
    return await this.brandRepo.save(brand);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return this.brandRepo.delete(id);
  }
}
