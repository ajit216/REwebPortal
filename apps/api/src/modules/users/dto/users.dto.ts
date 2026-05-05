import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsArray, IsOptional, MaxLength } from 'class-validator'

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Display name format: FirstName L.' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  displayName?: string

  @ApiPropertyOptional({ description: 'Preferred localities for alert personalization', example: ['Thane West', 'Mulund'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredLocalities?: string[]
}
