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
import Form from '@src/components/club/manage/form/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import OfficerListItem from '@src/components/club/manage/OfficerListItem';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editOfficerSchema } from '@src/utils/formSchemas';

type CollaboratorsProps = {
  club: SelectClub & { contacts: SelectContact[] };
  officers: {
    userId: string;
    name: string;
    locked: boolean;
    position: 'President' | 'Officer';
  }[];
};

const Collaborators = ({ club, officers }: CollaboratorsProps) => {
  const methods = useForm<z.infer<typeof editOfficerSchema>>({
    resolver: zodResolver(editOfficerSchema),
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

  // const [deleted, modifyDeleted] = useReducer(deletedReducer, []);

  // const removeItem = (index: number, userId: string) => {
  //   if (officers.find((officer) => officer.userId == userId))
  //     modifyDeleted({ type: 'add', target: userId });
  //   remove(index);
  // };

  const router = useRouter();
  const api = useTRPC();
  const editOfficers = useMutation(
    api.club.edit.officers.mutationOptions({
      onSuccess: () => {
        router.refresh();
      },
    }),
  );

  const submitForm = handleSubmit((data) => {
    // window.alert('Saved form!');
    window.alert('Pretend we saved the form!');
    console.log(JSON.stringify(data));
    // if (dirtyFields.officers !== undefined) {
    //   const { modified, created } = modifiedFields(
    //     dirtyFields.officers,
    //     data,
    //     officers,
    //   );
    //   if (!editOfficers.isPending) {
    //     editOfficers.mutate({
    //       clubId: clubId,
    //       deleted: deleted,
    //       modified: modified,
    //       created: created,
    //     });
    //   }
    // }
  });

  return (
    <Form
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={submitForm}
    >
      <FormFieldSet legend="Edit Club Collaborators">
        <div className="mx-4 text-slate-600 italic text-sm">
          <p>
            People in this list will have the ability to change settings, create
            events, and view members for this club.
          </p>
          <p>
            To add someone as a collaborator, they must have a UTD CLUBS
            account.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => '')}
        </div>
        <Button
          className="normal-case mb-2"
          startIcon={<AddIcon />}
          size="large"
          // onClick={() => {
          //   append({});
          // }}
          onClick={() => {
            window.alert('Not implemented yet. Sorry!');
          }}
        >
          Add Collaborator
        </Button>
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Collaborators;
