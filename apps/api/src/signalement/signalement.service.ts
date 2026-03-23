import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Signalement, SignalementDocument } from '@/signalement/schemas/signalement.schema';
import { CreateSignalementDto } from '@/signalement/dto/createsignalement.dto';

@Injectable()
export class SignalementService {
  constructor(
    @InjectModel(Signalement.name) private signalementModel: Model<SignalementDocument>,
  ) { }

  async create(createSignalementDto: CreateSignalementDto, userId: Types.ObjectId): Promise<SignalementDocument> {
    console.log("data send ",createSignalementDto);
    const newSignalement = new this.signalementModel({
      ...createSignalementDto,
      reportedBy: userId,
    });
    return await newSignalement.save();
  }
}
