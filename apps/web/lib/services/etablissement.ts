import api from '../api';

export type Etablissement = {
    _id: string;
    nom: string;
    code: string;
    ville: string;
    adresse?: string;
    type?: string;
};

export const getEtablissementCities = async (): Promise<string[]> => {
    const response = await api.get('/etablissements/public/cities');
    console.log(" response",response.data.data);
    return response.data.data || [];
};

export const getEtablissementsByCity = async (city: string): Promise<Etablissement[]> => {
    const response = await api.get('/etablissements/public', { params: { ville: city } });
    return response.data.data || [];
};
