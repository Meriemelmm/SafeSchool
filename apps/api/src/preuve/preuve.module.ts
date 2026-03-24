import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreuveService } from './preuve.service';
import { PreuveController } from './preuve.controller';
import { Preuve, PreuveSchema } from './schemas/preuve.schema';
import { Signalement,SignalementSchema } from '@/signalement/schemas/signalement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Preuve.name, schema: PreuveSchema },
      { name: Signalement.name, schema: SignalementSchema },]),
  ],
  controllers: [PreuveController],
  providers: [PreuveService],
  exports: [PreuveService],
})
export class PreuveModule {}
