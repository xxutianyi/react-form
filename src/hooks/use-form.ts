'use client';

import type { FormApi, FormData, FormErrors, UseFormProps } from '@/lib/form';
import { useEffect, useState } from 'react';

export function useForm(props: UseFormProps): FormApi {
  const { initialValues, onSubmit } = props;

  const [values, setValues] = useState<FormData | undefined | null>(initialValues);
  const [errors, setErrors] = useState<FormErrors>();

  function getFormValues() {
    return values;
  }

  function getFormErrors() {
    return errors;
  }

  function getFieldValue(fieldName: string) {
    return getFormValues()?.[fieldName] ?? '';
  }

  function getFieldError(fieldName: string) {
    return getFormErrors()?.[fieldName]?.map?.((message) => ({ message }));
  }

  function setFormValues(values: any) {
    setValues(values);
  }

  function setFormErrors(errors: FormErrors) {
    setErrors(errors);
  }

  function setFieldValue(fieldName: string, value: any) {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    if (getFieldError(fieldName)) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  }

  function handleSubmit(e?: any) {
    e?.preventDefault();
    onSubmit?.(values ?? {});
  }

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  return {
    handleSubmit,
    getFormValues,
    getFieldValue,
    getFieldError,
    setFieldValue,
    setFormValues,
    setFormErrors,
  };
}
