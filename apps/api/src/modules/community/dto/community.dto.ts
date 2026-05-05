import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateThreadDto {
  @ApiProperty()
  @IsString()
  communityGroupId: string

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title: string

  @ApiProperty({ maxLength: 2000 })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  body: string

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean
}

export class CreateReplyDto {
  @ApiProperty({ maxLength: 1000 })
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  body: string

  @ApiPropertyOptional({ description: 'Parent reply ID for nested replies (max 1 level)' })
  @IsString()
  @IsOptional()
  parentReplyId?: string

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean
}
