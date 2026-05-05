import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { LegalService } from './legal.service'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('Legal')
@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Get('resources')
  @Public()
  @ApiOperation({ summary: 'List legal resource articles (RERA rights, consumer forum guides, etc.)' })
  @ApiQuery({ name: 'category', required: false, enum: ['RERA_RIGHTS', 'CONSUMER_FORUM', 'SAMPLE_NOTICES', 'COURT_PROCEDURES', 'GLOSSARY', 'FAQ'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllResources(
    @Query('category') category?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.legalService.findAllResources(category, +page, +limit)
  }

  @Get('resources/:slug')
  @Public()
  @ApiOperation({ summary: 'Get full text of a legal article by slug' })
  findResource(@Param('slug') slug: string) {
    return this.legalService.findResourceBySlug(slug)
  }

  @Get('experts')
  @Public()
  @ApiOperation({ summary: 'List legal experts in the RERA / consumer law expert directory' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'offersProBono', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findExperts(
    @Query('city') city?: string,
    @Query('offersProBono') offersProBono?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.legalService.findAllExperts(
      city,
      offersProBono !== undefined ? offersProBono === 'true' : undefined,
      +page,
      +limit,
    )
  }
}
