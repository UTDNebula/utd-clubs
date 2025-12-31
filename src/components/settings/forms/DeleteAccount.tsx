import Panel from '@src/components/form/Panel';
import DeleteButton from '../DeleteButton';

export default function DeleteAccount() {
  return (
    <Panel
      heading="Delete Account"
      className="bg-red-100 border border-red-500"
    >
      <div className="ml-2 mb-4 text-slate-800 text-sm">
        <p>This will permenantly delete your account from UTD Clubs.</p>
      </div>
      <div>
        <DeleteButton />
      </div>
    </Panel>
  );
}
