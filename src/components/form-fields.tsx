'use client';

import { useFormContext } from '@/components/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Eye, EyeClosed } from 'lucide-react';
import { useRef, useState } from 'react';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, type FilePondProps, registerPlugin } from 'react-filepond';

export type FieldProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  description?: string;
  placeholder?: string;
};

export type SelectProps = FieldProps & {
  options: Record<string, any>[];
  optionsKey?: { label: string; value: string };
};

export type UploadProps = Omit<FieldProps, 'placeholder'> & {
  max?: number;
  accept?: string[];
  preview?: boolean;
  server?: FilePondProps['server'];
  filepond?: FilePondProps;
};

/**
 * 文本输入框
 * @param props
 * @constructor
 */
export function TextField({ name, label, description, disabled, placeholder }: FieldProps) {
  const formApi = useFormContext();
  if (formApi === null) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Input
        id={name}
        name={name}
        aria-label={name}
        disabled={disabled}
        value={formApi.getFieldValue(name)}
        onChange={(e) => formApi.setFieldValue(name, e.target.value)}
        placeholder={placeholder ?? '请输入'}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

/**
 * 密码输入框（带眼睛）
 * @param props
 * @constructor
 */
export function PasswordField({ name, label, description, disabled, placeholder }: FieldProps) {
  const formApi = useFormContext();
  const [visible, setVisible] = useState(false);

  if (formApi === null) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <InputGroup>
        <Input
          id={name}
          name={name}
          aria-label={name}
          disabled={disabled}
          value={formApi.getFieldValue(name)}
          onChange={(e) => formApi.setFieldValue(name, e.target.value)}
          placeholder={placeholder ?? '请输入'}
          type={visible ? 'text' : 'password'}
          data-slot="input-group-control"
          className="border-none bg-transparent focus-visible:ring-0"
        />
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" size="icon-sm" onClick={() => setVisible(!visible)}>
            {visible ? <Eye /> : <EyeClosed />}
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

/**
 * 多行输入框
 * @param props
 * @constructor
 */
export function TextareaField({ name, label, description, disabled, placeholder }: FieldProps) {
  const formApi = useFormContext();
  if (formApi === null) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Textarea
        id={name}
        name={name}
        aria-label={name}
        disabled={disabled}
        value={formApi.getFieldValue(name)}
        onChange={(e) => formApi.setFieldValue(name, e.target.value)}
        placeholder={placeholder ?? '请输入'}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

/**
 * 单选框
 * @param props
 * @constructor
 */
export function SelectField({ name, label, description, disabled, placeholder, options, optionsKey }: SelectProps) {
  optionsKey = optionsKey ?? { value: 'value', label: 'label' };

  const formApi = useFormContext();

  if (formApi === null) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Select
        disabled={disabled}
        value={formApi.getFieldValue(name)}
        onValueChange={(value) => formApi.setFieldValue(name, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder ?? '请选择'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => (
              <SelectItem key={index} value={option[optionsKey.value]}>
                {option[optionsKey.label]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

/**
 * 多选框
 * @param props
 * @constructor
 */
export function MutiSelectField({ name, label, description, disabled, placeholder, options, optionsKey }: SelectProps) {
  optionsKey = optionsKey ?? { value: 'value', label: 'label' };

  const formApi = useFormContext();

  if (formApi === null) return null;

  const currentValue = formApi?.getFieldValue(name);
  const selectedItems = options.filter((option) => currentValue.includes(option[optionsKey.value]));

  function handleSelect(newValue: string) {
    if (currentValue.includes(newValue)) {
      formApi?.setFieldValue(
        name,
        currentValue.filter((value: string) => value !== newValue),
      );
    } else {
      formApi?.setFieldValue(name, [...currentValue, newValue]);
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="h-auto min-h-10 w-full justify-between bg-input/50! px-3 py-2"
          >
            <div className="flex flex-wrap gap-2 overflow-hidden">
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => <Badge key={index}>{item[optionsKey.label]}</Badge>)
              ) : (
                <span className="text-muted-foreground">{placeholder ?? '请选择'}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          onWheel={(e) => e.stopPropagation()}
          className="pointer-events-auto w-(--radix-popover-trigger-width) p-0"
        >
          <Command>
            <CommandInput placeholder="搜索..." />
            <CommandList>
              <CommandEmpty>无匹配项</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => (
                  <CommandItem
                    key={index}
                    value={option[optionsKey.label]}
                    onSelect={() => handleSelect(option[optionsKey.value])}
                  >
                    <Check
                      className={cn(
                        currentValue.includes(option[optionsKey.value]) ? 'opacity-100' : 'opacity-0',
                        'mr-2 size-4',
                      )}
                    />
                    {option[optionsKey.label]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}

export function UploadField({
  name,
  label,
  description,
  disabled,
  max = 1,
  accept,
  preview,
  server,
  filepond,
}: UploadProps) {
  registerPlugin(FilePondPluginFileValidateType);
  if (preview) {
    registerPlugin(FilePondPluginImagePreview);
  }
  const formApi = useFormContext();
  const ref = useRef<FilePond>(null);

  function onFilesChange() {
    if (ref.current) {
      const files = ref.current?.getFiles().filter((file) => file.status === 5);
      const serverIds = max > 1 ? files.map((file) => file.serverId) : files?.[0]?.serverId;
      formApi?.setFieldValue(name, serverIds);
    }
  }

  if (formApi === null) return null;

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <FilePond
        ref={ref}
        id={name}
        name={name}
        server={server}
        maxFiles={max}
        allowMultiple={max > 1}
        disabled={disabled}
        acceptedFileTypes={accept}
        onremovefile={onFilesChange}
        onprocessfile={onFilesChange}
        credits={false}
        chunkUploads={true}
        labelIdle='拖拽文件到此处或 <span class="filepond--label-action"> 浏览文件 </span>'
        labelInvalidField="文件校验失败"
        labelFileWaitingForSize="检测文件大小"
        labelFileSizeNotAvailable="文件大小检测失败"
        labelFileLoading="加载中"
        labelFileLoadError="加载失败"
        labelFileProcessing="上传中"
        labelFileProcessingComplete="上传完成"
        labelFileProcessingAborted="上传中断"
        labelFileProcessingError="上传失败"
        labelFileProcessingRevertError="恢复失败"
        labelFileRemoveError="移除失败"
        labelTapToCancel="点击取消"
        labelTapToRetry="点击重试"
        labelTapToUndo="点击撤销"
        labelButtonRemoveItem="移除"
        labelButtonAbortItemLoad="中断"
        labelButtonRetryItemLoad="重试"
        labelButtonAbortItemProcessing="取消"
        labelButtonUndoItemProcessing="撤销"
        labelButtonRetryItemProcessing="重试"
        labelButtonProcessItem="上传"
        {...filepond}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {formApi.getFieldError(name) && <FieldError errors={formApi.getFieldError(name)} />}
    </Field>
  );
}
