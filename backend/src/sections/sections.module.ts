import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsResolver } from './sections.resolver';

@Module({
  providers: [SectionsService, SectionsResolver]
})
export class SectionsModule {}
