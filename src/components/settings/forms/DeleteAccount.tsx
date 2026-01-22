import Panel from '@src/components/common/Panel';
import DeleteButton from '@src/components/settings/DeleteButton';

export default function DeleteAccount() {
  return (
    <Panel
      heading="Delete Account"
      className="bg-red-100 dark:bg-red-950 border border-red-500 dark:border-red-700"
      description={
        <div className="text-slate-800 dark:text-slate-200">
          <p>This will permenantly delete your account from UTD Clubs.</p>
        </div>
      }
    >
      <div className="m-2 mt-0">
        <DeleteButton />
      </div>
    </Panel>
  );
}
