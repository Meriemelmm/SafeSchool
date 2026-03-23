import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreuveService } from './preuve.service';
import { PreuveController } from './preuve.controller';
import { Preuve, PreuveSchema } from './schemas/preuve.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Preuve.name, schema: PreuveSchema }]),
  ],
  controllers: [PreuveController],
  providers: [PreuveService],
  exports: [PreuveService],
})
export class PreuveModule {}
