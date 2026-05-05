import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString, IsEnum, IsOptional, IsBoolean, IsNumber,
  IsArray, IsInt, MaxLength, Min, Max, IsDateString,
} from 'class-validator'

export enum ProjectStatusDto {
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  NEARING_COMPLETION = 'NEARING_COMPLETION',
  READY_TO_MOVE = 'READY_TO_MOVE',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  STALLED = 'STALLED',
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsString()
  builderId: string

  @ApiProperty({ description: 'RERA registration number (format: P519XXXXXXXX)' })
  @IsString()
  reraNumber: string

  @ApiProperty({ enum: ProjectStatusDto, default: 'UNDER_CONSTRUCTION' })
  @IsEnum(ProjectStatusDto)
  @IsOptional()
  status?: ProjectStatusDto

  @ApiProperty()
  @IsString()
  city: string

  @ApiProperty()
  @IsString()
  locality: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subLocality?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pincode?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  totalUnits?: number

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[]

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  reraRegistrationDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  reraExpiryDate?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  approxPricePerSqFt?: number

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  priceRangeLow?: number

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  priceRangeHigh?: number
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ enum: ProjectStatusDto })
  @IsEnum(ProjectStatusDto)
  @IsOptional()
  status?: ProjectStatusDto

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  revisedCompletionDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  actualCompletionDate?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  delayMonths?: number

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[]
}

export class CreateBuilderDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsString()
  legalEntityName: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cinNumber?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  establishedYear?: number

  @ApiPropertyOptional({ default: 'Mumbai' })
  @IsString()
  @IsOptional()
  headquartersCity?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  websiteUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateBuilderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalEntityName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  websiteUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean
}

export class CreateRedFlagDto {
  @ApiProperty({ description: 'Type: rera_lapsed | stalled | mass_complaint | oc_delayed | rera_violation | custom' })
  @IsString()
  flagType: string

  @ApiProperty({ enum: ['WARNING', 'CRITICAL'] })
  @IsEnum(['WARNING', 'CRITICAL'])
  severity: 'WARNING' | 'CRITICAL'

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title: string

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description: string
}
