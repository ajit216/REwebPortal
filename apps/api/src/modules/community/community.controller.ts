import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { IsString, IsBoolean, IsOptional, MaxLength, IsNotEmpty } from 'class-validator'
import { CommunityService } from './community.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { Public } from '../../common/decorators/public.decorator'

export class CreateThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string

  @IsBoolean()
  isAnonymous: boolean
}

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string

  @IsBoolean()
  isAnonymous: boolean

  @IsString()
  @IsOptional()
  parentReplyId?: string
}

export class ReportThreadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string
}

@ApiTags('Community')
@UseGuards(JwtAuthGuard)
@Controller()
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Public()
  @Get('projects/:slug/community/threads')
  @ApiOperation({ summary: 'List threads for a project community forum (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getThreads(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getThreadsForProject(slug, page ? +page : 1, limit ? +limit : 20)
  }

  @Post('projects/:slug/community/threads')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new thread in a project community forum (auth required)' })
  createThread(
    @Param('slug') slug: string,
    @Body() dto: CreateThreadDto,
    @Request() req: any,
  ) {
    return this.communityService.createThread(slug, req.user.id, dto)
  }

  @Public()
  @Get('community/threads/:threadId/replies')
  @ApiOperation({ summary: 'Get replies for a thread (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getReplies(
    @Param('threadId') threadId: string,
    @Query('page') page?: string,
  ) {
    return this.communityService.getReplies(threadId, page ? +page : 1)
  }

  @Post('community/threads/:threadId/replies')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to a thread (auth required)' })
  createReply(
    @Param('threadId') threadId: string,
    @Body() dto: CreateReplyDto,
    @Request() req: any,
  ) {
    return this.communityService.createReply(threadId, req.user.id, dto)
  }

  @Post('community/threads/:threadId/upvote')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upvote a thread (auth required)' })
  upvoteThread(@Param('threadId') threadId: string) {
    return this.communityService.upvoteThread(threadId)
  }

  @Post('community/threads/:threadId/report')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report a thread for moderation (auth required)' })
  reportThread(
    @Param('threadId') threadId: string,
    @Body() dto: ReportThreadDto,
    @Request() req: any,
  ) {
    return this.communityService.reportThread(threadId, req.user.id, dto.reason)
  }
}
