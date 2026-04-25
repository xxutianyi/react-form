'use client';

import { useForm } from '@/hooks/use-form';
import type { FormApi, FormData } from '@/lib/form';
import { createContext, type ReactNode, useContext } from 'react';

export type FormProps = {
  form?: FormApi;
  children: ReactNode;
  className?: string;
  initialValues?: FormData | null;
  onSubmit?: (values?: FormData | null) => Promise<void>;
};

const FormContext = createContext<FormApi | null>(null);

export function Form({ form, children, className, initialValues, onSubmit }: FormProps) {
  const formApi =
    form ??
    useForm({
      initialValues: initialValues,
      onSubmit: async (values) => {
        try {
          await onSubmit?.(values);
        } catch (errors: any) {
          formApi.setFormErrors(errors);
        }
      },
    });

  return (
    <FormContext.Provider value={formApi}>
      <form className={className} onSubmit={formApi.handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext);
