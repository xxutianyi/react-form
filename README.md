# @winglab/react-form

A React form component using shadcn/ui & filepond.

## Install Component

```bash
# Component
npm install @winglab/react-form

# Dependencies
npm install radix-ui filepond react-filepond filepond-plugin-file-validate-type filepond-plugin-image-preview
```

## Basic usage

```tsx
// user/index.tsx
import { Form, TextareaField, TextField, UploadField } from '@winglab/react-form';

export default function FormPage() {
  return (
    <Form
      onSubmit={async (values) => {
        await sendToBackend(values!);
      }}
    >
      <FieldGroup>
        <UploadField
          name="avatar"
          label="Avatar"
          accept={['image/*']}
          preview={true}
          server={{
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
            headers: {
              'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') ?? '',
            },
            patch: { url: '/api/filepond?patch=', withCredentials: true },
            revert: { url: '/api/filepond', withCredentials: true },
            process: { url: '/api/filepond', withCredentials: true },
          }}
        />
        <TextField name="name" label="Name" />
        <TextareaField name="description" label="Description" />
        <Field>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </Form>
  );
}

```

## Validation

The form show validation errors default using catch error in onSubmit function.   
If your onSubmit function throw an error like``{ field1: ['error', 'error' ], field2: ['error', 'error']}``, it will auto display on the form.  
If you want to override this behavior, provide a useForm hook to Form component and set errors. **It will also override the ``onSubmit`` prop**.

```tsx
import { useForm } from '@winglab/react-form';
import { Form } from './form';

export default function FormPage() {
  const form = useForm({
    initialValues: {},
    onSubmit: async () => {
      //call some submit function
      //set errors hear
      form.setFormErrors({
        field1: ['error', 'error'],
        field2: ['error', 'error'],
      });

    },
  });

  //or set errors when you want
  form.setFormErrors({
    field1: ['error', 'error'],
    field2: ['error', 'error'],
  });

  return (
    <Form
      form={form}
      onSubmit={async (values) => {
        //this will never call
        await sendToBackend(values!);
      }}>
      {/*form fields*/}
    </Form>
  );
}

```

## Customize

### FormApi

If you want to change the form data state store or , just write your own FormApi hook like the default ``useForm``

```tsx
// Your FormApi
export function useYourForm(): FormApi {
  return {
    ...,
  };
}

// Use in component
export default function FormPage() {
  const form = useYourForm();

  return (
    <Form form={form}>
      {/*form fields*/}
    </Form>
  );
}
```