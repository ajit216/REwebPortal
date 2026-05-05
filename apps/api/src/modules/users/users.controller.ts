import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateProfileDto } from './dto/users.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with linked projects' })
  getMe(@Request() req: any) {
    return this.usersService.getMe(req.user.userId)
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update buyer profile (display name, preferred localities)' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto)
  }

  @Post('me/verify-ownership')
  @ApiOperation({ summary: 'Submit ownership verification document (PDF Agreement to Sale)' })
  verifyOwnership(
    @Request() req: any,
    @Body() body: { projectId: string; unitNumber: string; docKey: string },
  ) {
    return this.usersService.submitOwnershipVerification(
      req.user.userId,
      body.projectId,
      body.unitNumber,
      body.docKey,
    )
  }

  @Get('me/alerts')
  @ApiOperation({ summary: 'Get alerts for linked projects (red flags, grievance updates)' })
  getAlerts(@Request() req: any) {
    return this.usersService.getAlerts(req.user.userId)
  }
}
