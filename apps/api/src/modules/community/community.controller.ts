import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { CommunityService } from './community.service'
import { CreateThreadDto, CreateReplyDto } from './dto/community.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('groups/:projectId')
  @Public()
  @ApiOperation({ summary: 'Get community group info for a project' })
  getGroup(@Param('projectId') projectId: string) {
    return this.communityService.getGroup(projectId)
  }

  @Get('threads')
  @Public()
  @ApiOperation({ summary: 'Get threads for a project community group' })
  @ApiQuery({ name: 'projectId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['recent', 'popular'] })
  getThreads(
    @Query('projectId') projectId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortBy') sortBy = 'recent',
  ) {
    return this.communityService.getThreads(projectId, +page, +limit, sortBy)
  }

  @Post('threads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new forum thread (auth required)' })
  createThread(@Request() req: any, @Body() dto: CreateThreadDto) {
    return this.communityService.createThread(req.user.userId, dto)
  }

  @Get('threads/:threadId')
  @Public()
  @ApiOperation({ summary: 'Get thread detail with replies' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getThread(
    @Param('threadId') threadId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.communityService.getThread(threadId, +page, +limit)
  }

  @Post('threads/:threadId/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reply to a thread (auth required)' })
  createReply(
    @Request() req: any,
    @Param('threadId') threadId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.communityService.createReply(threadId, req.user.userId, dto)
  }

  @Patch('threads/:threadId/upvote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upvote a thread (auth required)' })
  upvoteThread(@Request() req: any, @Param('threadId') threadId: string) {
    return this.communityService.upvoteThread(threadId, req.user.userId)
  }

  @Post('groups/:projectId/whatsapp-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request to join WhatsApp group (verified buyer only)' })
  requestWhatsApp(@Request() req: any, @Param('projectId') projectId: string) {
    return this.communityService.requestWhatsApp(projectId, req.user.userId)
  }
}
