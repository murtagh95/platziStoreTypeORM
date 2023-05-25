import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsArray,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Product's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Product's description` })
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: `Product's price` })
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: `Product's stock` })
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: `Product's image` })
  readonly image: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ description: `Product's brand` })
  readonly brandId: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ description: `Product's categories` })
  readonly categoriesId: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
