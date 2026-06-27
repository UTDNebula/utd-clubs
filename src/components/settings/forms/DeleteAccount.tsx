import DeleteButton from '@src/components/settings/DeleteButton';
import Panel from '@src/nebula-library/components/Panel';

export default function DeleteAccount() {
  return (
    <Panel
      heading="Delete Account"
      className="border border-red-500 bg-red-100 dark:border-red-700 dark:bg-red-950"
      description={
        <div className="text-slate-800 dark:text-slate-200">
          <p>This will permanently delete your account from UTD Clubs.</p>
        </div>
      }
    >
      <div className="m-2 mt-0">
        <DeleteButton />
      </div>
    </Panel>
  );
}
