// validations/register.validation.ts
import * as Yup from 'yup';
import { UserRole } from 'shared/enums';

// ─── Step 1 : Identité ───────────────────────────────────────────────────────
export const step1Schema = Yup.object({
    role: Yup.string()
        .oneOf(Object.values(UserRole), 'Invalid role')
        .required('Role is required'),

    firstName: Yup.string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .required('First name is required'),

    lastName: Yup.string()
        .trim()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at most 50 characters')
        .required('Last name is required'),

    email: Yup.string()
        .trim()
        .lowercase()
        .email('Please enter a valid email address')
        .required('Email is required'),

    acceptedTerms: Yup.boolean()
        .oneOf([true], 'You must accept the confidentiality agreement')
        .required(),
});

// ─── Step 2 : Sécurité du compte ─────────────────────────────────────────────
export const step2Schema = Yup.object({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),

    phone: Yup.string()
        .optional()
        .test('phone-format', 'Phone number must be a valid Moroccan number (+212 or 0)', (val) => {
            if (!val || val.trim() === '') return true;
            return /^(\+212|0)([5-7][0-9]{8})$/.test(val.replace(/\s/g, ''));
        }),
});

// ─── Step 3 : École — schéma commun ──────────────────────────────────────────
const cityField = Yup.string().required('City is required');
const etablissementField = Yup.string().required('Please select an establishment');

export const step3StudentSchema = Yup.object({
    ville: cityField,
    etablissementId: etablissementField,
    classe: Yup.string().optional(),
});

export const step3ParentSchema = Yup.object({
    relation: Yup.string()
        .oneOf(['père', 'mère', 'tuteur', 'autre'], 'Please select a valid relationship')
        .required('Relationship is required'),
});

export const step3TeacherSchema = Yup.object({
    ville: cityField,
    etablissementId: etablissementField,
    matiere: Yup.string().optional(),
});

export const step3AdminSchema = Yup.object({
    ville: cityField,
    etablissementId: Yup.string().optional(),
});

// ─── Helper : récupère le bon schéma Step 3 selon le rôle ────────────────────
export const getStep3Schema = (role: UserRole) => {
    switch (role) {
        case UserRole.STUDENT:
            return step3StudentSchema;
        case UserRole.PARENT:
            return step3ParentSchema;
        case UserRole.TEACHER:
            return step3TeacherSchema;
        case UserRole.ADMIN:
            return step3AdminSchema;
        default:
            return step3StudentSchema;
    }
};

