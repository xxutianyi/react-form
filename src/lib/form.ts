export type FormData = Record<string, any>;
export type FormErrors = Record<string, string[] | undefined>;

export type UseFormProps = {
  initialValues?: FormData | null;
  onSubmit?: (values: FormData) => Promise<void>;
};

export type FormApi = {
  handleSubmit: (e?: any) => void;
  getFormValues: () => FormData | undefined | null;
  getFieldValue: (fieldName: string) => any | '';
  getFieldError: (fieldName: string) => { message: string }[] | undefined;
  setFormValues: (values: FormData | any) => void;
  setFormErrors: (errors: FormErrors) => void;
  setFieldValue: (fieldName: string, value: any) => void;
};
