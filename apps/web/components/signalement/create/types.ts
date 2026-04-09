import { Nature, TypeViolence, NiveauGravite } from 'shared/enums/signalement-enums';
import { RoleIncident } from 'shared/enums/roleIncedent.enum';

export interface SignalementFormData {
  // Step 1 - Incident Details
  title: string;
  description: string;
  nature: Nature;
  typeViolence: TypeViolence;
  gravite: NiveauGravite;
  isAnonymous: boolean;
  // Step 2 - Location & Time
  dateIncident: string;
  location: string;
}

export interface MemberFormData {
  firstName: string;
  lastName: string;
  role: RoleIncident;
}

export const INITIAL_FORM_DATA: SignalementFormData = {
  title: '',
  description: '',
  nature: Nature.AGGRESSION,
  typeViolence: TypeViolence.PHYSICAL,
  gravite: NiveauGravite.FAIBLE,
  isAnonymous: false,
  dateIncident: new Date().toISOString().split('T')[0],
  location: '',
};
