import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator'

export enum GrievanceCategory {
  POSSESSION_DELAY = 'POSSESSION_DELAY',
  CONSTRUCTION_QUALITY = 'CONSTRUCTION_QUALITY',
  AMENITIES_NOT_DELIVERED = 'AMENITIES_NOT_DELIVERED',
  FINANCIAL_DISCREPANCY = 'FINANCIAL_DISCREPANCY',
  LEGAL_TITLE_ISSUE = 'LEGAL_TITLE_ISSUE',
  POOR_COMMUNICATION = 'POOR_COMMUNICATION',
  OC_CERTIFICATE_DELAY = 'OC_CERTIFICATE_DELAY',
  RERA_VIOLATION = 'RERA_VIOLATION',
  OTHER = 'OTHER',
}

export enum GrievanceSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum GrievanceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED_UNRESOLVED = 'CLOSED_UNRESOLVED',
}

export class CreateGrievanceDto {
  @ApiProperty({ description: 'Project ID to file grievance against' })
  @IsString()
  projectId: string

  @ApiProperty({ enum: GrievanceCategory })
  @IsEnum(GrievanceCategory)
  category: GrievanceCategory

  @ApiProperty({ enum: GrievanceSeverity })
  @IsEnum(GrievanceSeverity)
  severity: GrievanceSeverity

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string

  @ApiProperty({ maxLength: 1500 })
  @IsString()
  @MinLength(20)
  @MaxLength(1500)
  description: string

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean
}

export class UpdateGrievanceStatusDto {
  @ApiProperty({ enum: GrievanceStatus })
  @IsEnum(GrievanceStatus)
  status: GrievanceStatus

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string

  @ApiPropertyOptional({ description: 'Escalation target (RERA, Consumer Forum, etc.)' })
  @IsString()
  @IsOptional()
  escalatedTo?: string
}
