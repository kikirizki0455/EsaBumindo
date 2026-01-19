// src/articles/articles.module.ts

import { Module } from '@nestjs/common';
import { ArticlesController } from './article.controller';
import { ArticlesService } from './article.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
