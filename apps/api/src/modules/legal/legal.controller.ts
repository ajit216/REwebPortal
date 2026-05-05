import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { LegalService } from './legal.service'

@ApiTags('Legal')
@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Get('resources')
  @ApiOperation({ summary: 'List legal resources with optional category filter' })
  @ApiQuery({ name: 'category', required: false, description: 'RERA_RIGHTS | CONSUMER_FORUM | SAMPLE_NOTICES | COURT_PROCEDURES | GLOSSARY | FAQ' })
  findAll(@Query('category') category?: string) {
    return this.legalService.findAllResources(category)
  }

  @Get('resources/:slug')
  @ApiOperation({ summary: 'Get a single legal resource by slug' })
  findOne(@Param('slug') slug: string) {
    return this.legalService.findResourceBySlug(slug)
  }

  @Get('experts')
  @ApiOperation({ summary: 'List verified legal experts in Mumbai & Thane' })
  findExperts() {
    return this.legalService.findAllExperts()
  }
}
