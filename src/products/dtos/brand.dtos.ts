import { IsString, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Brand's name` })
  readonly name: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: `Brand's image` })
  readonly image: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
