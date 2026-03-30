import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { EtablissementService } from '@/etablissement/etablissement.service';
import { Etablissement } from '@/etablissement/schemas/etablissement.schema';

// ─── Helpers ────────────────────────────────────────────────────────────────

const mockId = new Types.ObjectId();

const makeEtab = (overrides: Partial<any> = {}): any => ({
  _id: mockId,
  nom: 'Lycée Atlas',
  code: 'LYC-001',
  type: 'Lycée',
  ville: 'Nador',
  adresse: '12 rue des écoles',
  isActive: true,
  isDeleted: false,
  deletedAt: null,
  ...overrides,
});

const chainable = (value) => ({
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(value),
});

const createMockModel = () => {
  const model: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ _id: mockId, ...dto }),
  }));

  model.findOne = jest.fn();
  model.find = jest.fn();
  model.findById = jest.fn();
  model.findByIdAndUpdate = jest.fn();
  model.countDocuments = jest.fn();
  model.distinct = jest.fn();
  model.create = jest.fn();

  return model;
};

// ─── Suite principale ────────────────────────────────────────────────────────

describe('EtablissementService', () => {
  let service: EtablissementService;
  let model: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    model = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtablissementService,
        {
          provide: getModelToken(Etablissement.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<EtablissementService>(EtablissementService);
  });

  afterEach(() => jest.clearAllMocks());

  // ══════════════════════════════════════════════════════════════════════════
  // CREATE
  // ══════════════════════════════════════════════════════════════════════════

  describe('create()', () => {
    const dto = {
      nom: 'Lycée Atlas',
      code: 'LYC-001',
      type: 'Lycée',
      ville: 'Nador',
      adresse: '12 rue des écoles',
    };

    it(`cree et retourne un etablissement quand nom et code sont uniques`, async () => {
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue({ _id: mockId, ...dto });

      const result = await service.create(dto  as any);

      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ nom: dto.nom }, { code: dto.code }],
      });
      expect(model.create).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject({ nom: dto.nom, code: dto.code });
    });

    it(`leve ConflictException si le nom existe deja`, async () => {
      model.findOne.mockResolvedValue(makeEtab());

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
      expect(model.create).not.toHaveBeenCalled();
    });

    it(`leve ConflictException si le code existe deja`, async () => {
      model.findOne.mockResolvedValue(makeEtab({ nom: 'Autre', code: dto.code }));

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });

    it(`leve ConflictException si nom ET code existent tous les deux`, async () => {
      model.findOne.mockResolvedValue(makeEtab());

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FIND ALL
  // ══════════════════════════════════════════════════════════════════════════

  describe('findAll()', () => {
    const mockData = [
      makeEtab(),
      makeEtab({ _id: new Types.ObjectId(), nom: 'CEM Ibn Batouta' }),
    ];

    const setupFind = (data: any[], total: number) => {
      model.find.mockReturnValue(chainable(data));
      model.countDocuments.mockResolvedValue(total);
    };

    it(`retourne donnees et meta avec valeurs par defaut (page=1, limit=10)`, async () => {
      setupFind(mockData, 2);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(2);
      expect(result.meta).toMatchObject({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it(`filtre isDeleted:false dans tous les cas`, async () => {
      setupFind([], 0);

      await service.findAll({});

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.isDeleted).toBe(false);
    });

    it(`applique la recherche globale (search) sur nom/code/ville/adresse`, async () => {
      setupFind(mockData, 2);

      await service.findAll({ search: 'atlas' });

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.$or).toBeDefined();
      expect(filterArg.$or).toHaveLength(4);
    });

    it(`ignore les espaces dans search`, async () => {
      setupFind([], 0);

      await service.findAll({ search: '  atlas  ' });

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.$or[0].nom.source).toBe('atlas');
    });

    it(`applique le filtre type`, async () => {
      setupFind([], 0);

      await service.findAll({ type: 'Lycée' } as any);

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.type).toBe('Lycée');
    });

    it(`applique le filtre ville quand search est absent`, async () => {
      setupFind([], 0);

      await service.findAll({ ville: 'Nador' });

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.ville).toBeDefined();
    });

    it(`n'applique pas le filtre ville si search est present`, async () => {
      setupFind([], 0);

      await service.findAll({ search: 'atlas', ville: 'Nador' });

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.ville).toBeUndefined();
    });

    it(`applique le filtre isActive=true`, async () => {
      setupFind([], 0);

      await service.findAll({ isActive: true } as any);

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.isActive).toBe(true);
    });

    it(`applique le filtre isActive=false`, async () => {
      setupFind([], 0);

      await service.findAll({ isActive: false } as any);

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.isActive).toBe(false);
    });

    it(`pagination - calcule correctement totalPages, hasNextPage et hasPrevPage`, async () => {
      setupFind(mockData, 25);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.meta).toMatchObject({
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });

    it(`hasNextPage est false sur la derniere page`, async () => {
      setupFind(mockData, 20);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.meta.hasNextPage).toBe(false);
    });

    it(`retourne donnees vides si aucun resultat`, async () => {
      setupFind([], 0);

      const result = await service.findAll({ search: 'zzz' });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FIND ONE
  // ══════════════════════════════════════════════════════════════════════════

  describe('findOne()', () => {
    it(`retourne l'etablissement si trouve`, async () => {
      const etab = makeEtab();
      model.findById.mockResolvedValue(etab);

      const result = await service.findOne(mockId);

      expect(model.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(etab);
    });

    it(`leve NotFoundException si non trouve`, async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.findOne(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FIND CITIES
  // ══════════════════════════════════════════════════════════════════════════

  describe('findCities()', () => {
    it(`retourne la liste des villes triees alphabetiquement`, async () => {
      model.distinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue(['Oujda', 'Nador', 'Berkane']),
      });

      const result = await service.findCities();

      expect(result).toEqual(['Berkane', 'Nador', 'Oujda']);
    });

    it(`passe le bon filtre a distinct (isDeleted:false, isActive:true)`, async () => {
      model.distinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findCities();

      expect(model.distinct).toHaveBeenCalledWith('ville', {
        isDeleted: false,
        isActive: true,
      });
    });

    it(`retourne tableau vide si aucune ville`, async () => {
      model.distinct.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

      const result = await service.findCities();

      expect(result).toEqual([]);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FIND BY CITY
  // ══════════════════════════════════════════════════════════════════════════

  describe('findByCity()', () => {
    it(`retourne les etablissements actifs de la ville (regex exact, insensible a la casse)`, async () => {
      const etabs = [makeEtab()];
      model.find.mockReturnValue(chainable(etabs));

      const result = await service.findByCity('Nador');

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.isDeleted).toBe(false);
      expect(filterArg.isActive).toBe(true);
      expect(filterArg.ville.source).toBe('^Nador$');
      expect(result).toEqual(etabs);
    });

    it(`ignore les espaces autour du nom de ville`, async () => {
      model.find.mockReturnValue(chainable([]));

      await service.findByCity('  Oujda  ');

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.ville.source).toBe('^Oujda$');
    });

    it(`retourne tableau vide si ville introuvable`, async () => {
      model.find.mockReturnValue(chainable([]));

      const result = await service.findByCity('VilleInconnue');

      expect(result).toEqual([]);
    });

    it(`fonctionne avec une chaine vide - aucun filtre ville applique`, async () => {
      model.find.mockReturnValue(chainable([]));

      await service.findByCity('');

      const filterArg = model.find.mock.calls[0][0];
      expect(filterArg.ville).toBeUndefined();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // ══════════════════════════════════════════════════════════════════════════

  describe('update()', () => {
    const updateDto = { nom: 'Lycée Atlas Modifié' } as any;

    it(`met a jour et retourne l'etablissement modifie`, async () => {
      const updated = makeEtab({ nom: 'Lycée Atlas Modifié' });
      model.findById.mockResolvedValue(makeEtab());
      model.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.update(mockId, updateDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        { ...updateDto },
        { new: true },
      );
      expect(result).toEqual(updated);
    });

    it(`leve NotFoundException si etablissement inexistant`, async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.update(mockId, updateDto)).rejects.toThrow(NotFoundException);
      expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // DES OR ACTIVE
  // ══════════════════════════════════════════════════════════════════════════

  describe('DesOrActive()', () => {
    it(`desactive un etablissement actif`, async () => {
      model.findById.mockResolvedValue(makeEtab({ isActive: true }));
      model.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.DesOrActive(mockId);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { isActive: false });
      expect(result).toEqual({ message: 'Établissement désactivé avec succès' });
    });

    it(`active un etablissement inactif`, async () => {
      model.findById.mockResolvedValue(makeEtab({ isActive: false }));
      model.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.DesOrActive(mockId);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { isActive: true });
      expect(result).toEqual({ message: 'Établissement activé avec succès' });
    });

    it(`leve NotFoundException si etablissement inexistant`, async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.DesOrActive(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SOFT DELETE
  // ══════════════════════════════════════════════════════════════════════════

  describe('softDelete()', () => {
    it(`effectue le soft delete avec isDeleted:true, isActive:false et deletedAt`, async () => {
      model.findById.mockResolvedValue(makeEtab({ isDeleted: false }));
      model.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.softDelete(mockId);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        expect.objectContaining({
          isDeleted: true,
          isActive: false,
          deletedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual({ message: 'Établissement supprimé avec succès' });
    });

    it(`leve NotFoundException si etablissement inexistant`, async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.softDelete(mockId)).rejects.toThrow(NotFoundException);
      expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it(`leve BadRequestException si deja supprime`, async () => {
      model.findById.mockResolvedValue(makeEtab({ isDeleted: true }));

      await expect(service.softDelete(mockId)).rejects.toThrow(BadRequestException);
      expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });
});