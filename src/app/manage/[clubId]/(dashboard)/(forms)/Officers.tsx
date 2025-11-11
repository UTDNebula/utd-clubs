'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import {
  useFieldArray,
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import type z from 'zod';
import Form from '@src/components/club/manage/components/Form';
import {
  FormButtons,
  FormFieldSet,
  FormInput,
  FormTextArea,
} from '@src/components/club/manage/FormComponents';
import OfficerListItem from '@src/components/club/manage/OfficerListItem';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editListedOfficerSchema } from '@src/utils/formSchemas';

type x = {
  id?: boolean;
  name?: boolean;
  position?: boolean;
  isPresident?: boolean;
}[];

const modifiedFields = (
  dirtyFields: x,
  data: z.infer<typeof editListedOfficerSchema>,
  officers: {
    id?: string;
    name: string;
    position: string;
    isPresident: boolean;
  }[],
) => {
  const modded = data.officers.filter(
    (value, index) =>
      !!officers.find((off) => off.id === value.id) &&
      (dirtyFields[index]?.position || dirtyFields[index]?.isPresident),
  );

  const created = data.officers.filter(
    (value) => typeof value.id === 'undefined',
  );

  return {
    modified: modded as {
      id: string;
      name: string;
      position: string;
      isPresident: boolean;
    }[],
    created: created as {
      name: string;
      position: string;
      isPresident: boolean;
    }[],
  };
};

type modifyDeletedAction =
  | {
      type: 'add';
      target: string;
    }
  | { type: 'reset' };

const deletedReducer = (state: Array<string>, action: modifyDeletedAction) => {
  switch (action.type) {
    case 'add':
      return [...state, action.target];
    case 'reset':
      return [];
  }
};

// ---

type OfficersProps = {
  club: SelectClub & { contacts: SelectContact[] };
  officers: {
    id: string;
    name: string;
    position: string;
    isPresident: boolean;
  }[];
};

const Officers = ({ club, officers }: OfficersProps) => {
  const methods = useForm<z.infer<typeof editListedOfficerSchema>>({
    resolver: zodResolver(editListedOfficerSchema),
    defaultValues: { officers: officers },
    mode: 'onTouched',
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, dirtyFields, isDirty },
  } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'officers',
    keyName: 'fieldId',
  });

  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);

  const removeItem = (index: number) => {
    const off = officers.find((officer) => {
      return officer.id == fields[index]?.id;
    });
    if (off) modifyDeleted({ type: 'add', target: off.id });
    remove(index);
  };

  const makePresident = (index: number) => {
    // Set officer at index as president; set every other officer to be not president
    for (let i = 0; i < fields.length; i++) {
      if ((i == index) != fields[i]!.isPresident) {
        update(i, {
          ...getValues(`officers.${i}`),
          position: i == index ? 'President' : 'Officer',
          isPresident: i == index,
        });
      }
    }
  };
  const router = useRouter();
  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.listedOfficers.mutationOptions({
      onSuccess: () => {
        // router.push(`/directory/${club.id}`);
        router.refresh();
      },
    }),
  );

  const submitForm = handleSubmit((data) => {
    window.alert('Saved form!');
    console.log(JSON.stringify(data));
    if (dirtyFields.officers !== undefined) {
      const { modified, created } = modifiedFields(
        dirtyFields.officers,
        data,
        officers,
      );
      if (!editOfficers.isPending) {
        editOfficers.mutate({
          clubId: club.id,
          deleted: deleted,
          modified: modified,
          created: created,
        });
      }
    }
  });

  return (
    <Form
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={submitForm}
    >
      <FormFieldSet legend="Edit Officers">
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <OfficerListItem
              key={field.fieldId}
              register={register}
              index={index}
              makePresident={makePresident}
              isPresident={field.isPresident}
              remove={removeItem}
              errors={errors}
            />
          ))}
        </div>
        <Button
          className="normal-case mb-2"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => {
            append({ name: '', position: '', isPresident: false });
          }}
        >
          Add Officer
        </Button>
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Officers;
