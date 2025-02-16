import {
  IsDate,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PriceDto {
  @IsNumber()
  @IsOptional()
  value: number;

  @IsDateString()
  @IsOptional()
  date: Date;
}

export class ProductQueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  price?: PriceDto;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastUpdated?: Date;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  availability?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
