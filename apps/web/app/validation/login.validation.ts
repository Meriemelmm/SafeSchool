// validations/register.validation.ts
import * as Yup from 'yup';
import { UserRole } from 'shared/enums';



// ─── Login Schema ───────────────────────────────────────────────────────────
export const loginSchema = Yup.object({
    email: Yup.string()
        .trim()
        .lowercase()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: Yup.string()
        .required('Password is required'),
});