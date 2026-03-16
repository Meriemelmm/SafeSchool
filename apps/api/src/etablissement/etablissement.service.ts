import { Injectable, ConflictException, NotFoundException ,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {EtablissementUpdateDto} from '@/etablissement/dto/EtablissementUpdate.dto';
import { Types } from 'mongoose';



import { Etablissement, EtablissementDocument } from './schemas/etablissement.schema';
import { CreateEtablissementDto } from '@/etablissement/dto/EtablssementCreate.dto';
import { QueryEtablissementDto } from '@/etablissement/dto/query-etablissement.dto';

@Injectable()
export class EtablissementService {
  constructor(
    @InjectModel(Etablissement.name)
    private readonly etablissementModel: Model<EtablissementDocument>,
  ) {}

  // ─── CREATE ─────────────────────────────────────────────────────────────────
  async create(dto: CreateEtablissementDto): Promise<Etablissement> {
    const existing = await this.etablissementModel.findOne({
      $or: [{ nom: dto.nom }, { code: dto.code }],
    });

    if (existing) {
      throw new ConflictException(
        'Un établissement avec ce nom ou ce code existe déjà.',
      );
    }

    return this.etablissementModel.create(dto);
  }

  // ─── FIND ALL (search + filter + pagination) ────────────────────────────────
 async findAll(query: QueryEtablissementDto) {
  const { search, type, ville, isActive, page = 1, limit = 10 } = query;

  const filter: any = {
    isDeleted: false,
  };

  //  Search global — nom OU code OU ville
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i'); 
    filter.$or = [{ nom: regex }, { code: regex }, { ville: regex },{adresse:regex}];
  }

  //  Filtres 
  if (type) filter.type = type;


  if (ville?.trim() && !search) {
    filter.ville = new RegExp(ville.trim(), 'i');
  }

  if (isActive !== undefined) filter.isActive = isActive;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.etablissementModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec(),
    this.etablissementModel.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,                       
    },
  };
}
 async findOne(id: Types.ObjectId) {
  const etablissement = await this.etablissementModel.findById(id);
  if (!etablissement) {
    throw new NotFoundException('Établissement non trouvé'); 
  }
  return etablissement;
}

async update(id: Types.ObjectId, data: EtablissementUpdateDto) {
  const etablissement = await this.etablissementModel.findById(id);
  if (!etablissement) {
    throw new NotFoundException('Établissement non trouvé'); 
  }

  const updated = await this.etablissementModel.findByIdAndUpdate(
    id,
    { ...data },
    { new: true }, 
  );

  return updated;
}
 async DesOrActive(id: Types.ObjectId){
  const etablissement = await this.etablissementModel.findById(id);
  if (!etablissement) {
    throw new NotFoundException('Établissement non trouvé'); 
  }
  if (etablissement.isActive) {
    await this.etablissementModel.findByIdAndUpdate(id, { isActive: false });
    return { message: 'Établissement désactivé avec succès' };
  } else {
    await this.etablissementModel.findByIdAndUpdate(id, { isActive: true });
    return { message: 'Établissement activé avec succès' };
  }

 }
 async softDelete(id: Types.ObjectId): Promise<{ message: string }> {
    const etablissement = await this.etablissementModel.findById(id);
    if(!etablissement){
      throw new NotFoundException('Établissement non trouvé');
    }
 
    if (etablissement.isDeleted) {
      throw new BadRequestException('Établissement déjà supprimé');
    }
 
    await this.etablissementModel.findByIdAndUpdate(id, {
      isDeleted: true,      
      deletedAt: new Date(), 
      isActive: false,       
   
    });
 
    return { message: 'Établissement supprimé avec succès' };
  }
}

