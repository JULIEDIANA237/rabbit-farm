import { Module } from '@nestjs/common';
import { CagesService } from './cages.service';

@Module({
  providers: [CagesService]
})
export class CagesModule {}
