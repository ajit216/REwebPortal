import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, IsNumberString, Length, IsEmail, MinLength } from 'class-validator'

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210', description: 'India mobile number with country code' })
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'phone must be a valid Indian mobile number (+91XXXXXXXXXX)' })
  phone: string
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, { message: 'phone must be a valid Indian mobile number' })
  phone: string

  @ApiProperty({ example: '482910' })
  @IsNumberString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@rewebportal.in' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Admin@REwebPortal2025!' })
  @IsString()
  @MinLength(8)
  password: string
}
