import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';

export interface FormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export interface UseFormValidationResult<T extends Record<string, string>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (
    onValid: (values: T) => void | Promise<void>
  ) => (e: FormEvent<HTMLFormElement>) => void;
  reset: () => void;
}

// Brazilian phone (with or without formatting) or email
const phoneOrEmail = /^([^\s@]+@[^\s@]+\.[^\s@]+|\(?\d{2}\)?\s?9?\d{4}-?\d{4})$/;

export const defaultValidators: Record<string, (v: string) => string | null> = {
  name: (v) => (v.trim().length >= 3 ? null : 'Nome deve ter ao menos 3 caracteres.'),
  contact: (v) => (phoneOrEmail.test(v.trim()) ? null : 'Informe um telefone ou e-mail válido.'),
  message: (v) => (v.trim().length >= 10 ? null : 'Mensagem deve ter ao menos 10 caracteres.'),
};

export function useFormValidation<T extends Record<string, string>>(
  initial: T
): UseFormValidationResult<T> {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear error as user types
      setErrors((prev) => {
        if (!prev[name as keyof T]) return prev;
        const next = { ...prev };
        delete next[name as keyof T];
        return next;
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;
    for (const key of Object.keys(values) as Array<keyof T>) {
      const validator = defaultValidators[key as string];
      if (validator) {
        const err = validator(values[key]);
        if (err) {
          newErrors[key] = err;
          valid = false;
        }
      }
    }
    setErrors(newErrors);
    return valid;
  }, [values]);

  const handleSubmit = useCallback(
    (onValid: (values: T) => void | Promise<void>) =>
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        void Promise.resolve(onValid(values));
      },
    [validate, values]
  );

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  return { values, errors, handleChange, handleSubmit, reset };
}
