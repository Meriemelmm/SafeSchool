// hooks/useStepValidation.ts
import { useState, useCallback } from 'react';
import * as Yup from 'yup';

/**
 * Hook générique pour valider un objet avec un schéma Yup.
 * Retourne les erreurs champ par champ + une fonction validate().
 */
export function useStepValidation<T extends object>(schema: Yup.ObjectSchema<any>) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback(
    async (data: T): Promise<boolean> => {
      try {
        await schema.validate(data, { abortEarly: false });
        setFieldErrors({});
        return true;
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors: Partial<Record<keyof T, string>> = {};
          err.inner.forEach((e) => {
            if (e.path) {
              errors[e.path as keyof T] = e.message;
            }
          });
          setFieldErrors(errors);
        }
        return false;
      }
    },
    [schema],
  );

  /** Efface l'erreur d'un champ précis quand l'utilisateur commence à taper */
  const clearError = useCallback((field: keyof T) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { fieldErrors, validate, clearError };
}