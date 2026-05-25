import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { CreateReviewDto } from './dto/create-review.dto'

import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(
      req.user.id,
      dto,
    )
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reviewsService.findById(id)
  }
}