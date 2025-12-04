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
import CollaboratorListItem from '@src/components/club/manage/CollaboratorListItem';
import Form from '@src/components/club/manage/form/Form';
import {
  FormButtons,
  FormFieldSet,
} from '@src/components/club/manage/FormComponents';
import OfficerListItem from '@src/components/club/manage/OfficerListItem';
import { UserSearchBar } from '@src/components/searchBar/UserSearchBar';
import type { SelectClub, SelectContact } from '@src/server/db/models';
import { useTRPC } from '@src/trpc/react';
import { editOfficerSchema } from '@src/utils/formSchemas';

type x = {
  userId?: boolean;
  name?: boolean;
  locked?: boolean;
  title?: boolean;
  position?: boolean;
}[];
const modifiedFields = (
  dirtyFields: x,
  data: z.infer<typeof editOfficerSchema>,
  officers: {
    userId: string;
    name: string;
    locked: boolean;
    position: string;
  }[],
) => {
  const modded = data.officers.filter(
    (value, index) =>
      !!officers.find((off) => off.userId === value.userId) &&
      dirtyFields[index]?.title,
  );
  const created = data.officers.filter(
    (value, index) => dirtyFields[index]?.userId,
  );
  return {
    modified: modded,
    created: created,
  };
};

type modifyDeletedAction =
  | {
      type: 'add';
      target: z.infer<typeof editOfficerSchema>['officers'][number]['userId'];
    }
  | { type: 'reset' };
const deletedReducer = (
  state: Array<z.infer<typeof editOfficerSchema>['officers'][number]['userId']>,
  action: modifyDeletedAction,
) => {
  switch (action.type) {
    case 'add':
      return [...state, action.target];
    case 'reset':
      return [];
  }
};

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

  const [deleted, modifyDeleted] = useReducer(deletedReducer, []);

  const removeItem = (index: number, userId: string) => {
    if (officers.find((officer) => officer.userId == userId))
      modifyDeleted({ type: 'add', target: userId });
    remove(index);
  };

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
    <Form methods={methods} onSubmit={submitForm}>
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
        <div className="flex flex-col">
          {fields.map((field, index) => (
            <CollaboratorListItem
              key={field.fieldId}
              index={index}
              id={field.userId}
              remove={removeItem}
              locked={field.locked}
              name={field.name}
            />
          ))}
        </div>
        <div className="hover:bg-royal/4 transition-colors rounded-full flex justify-center">
          {/* <div className="w-96"> */}
          <div className="w-full">
            <UserSearchBar
              placeholder="Add Collaborator..."
              // className="transition-colors hover:[&>.MuiInputBase-root]:bg-royal/4 rounded-full"
              passUser={(user) => {
                append({
                  userId: user.id,
                  name: user.name,
                  // title: 'Officer',
                  position: 'Officer',
                  locked: false,
                });
              }}
            />
          </div>
        </div>
        {/* <Button
          className="normal-case mb-2"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => {
            window.alert('Not implemented yet. Sorry!');
          }}
        >
          Add Collaborator
        </Button> */}
        <FormButtons />
      </FormFieldSet>
    </Form>
  );
};

export default Collaborators;

// type CollaboratorItemProps = {
//   remove: (index: number, userId: string) => void;
//   id: string;
//   index: number;
//   name: string;
//   locked: boolean;
// };

// const CollaboratorItem = ({
//   index,
//   id,
//   name,
//   remove,
//   locked,
// }: CollaboratorItemProps) => {
//   return (
//     <div className="flex flex-row items-center rounded-md bg-slate-300 p-2">
//       <div className="flex flex-col">
//         <div>
//           <h4 className="mb-1 bg-slate-300 text-xl font-bold text-black">
//             {name}
//           </h4>
//         </div>
//       </div>
//       <button
//         className="ml-auto disabled:hidden"
//         type="button"
//         onClick={() => remove(index, id)}
//         disabled={locked}
//       >
//         remove
//       </button>
//     </div>
//   );
// };
