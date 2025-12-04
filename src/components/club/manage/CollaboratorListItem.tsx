import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { IconButton, Tooltip } from '@mui/material';
import FormTextField from './form/FormTextField';

type CollaboratorListItemProps = {
  remove: (index: number, userId: string) => void;
  id: string;
  index: number;
  name: string;
  locked: boolean;
};

const CollaboratorListItem = ({
  index,
  id,
  name,
  remove,
  locked,
}: CollaboratorListItemProps) => {
  return (
    <div className="flex flex-row hover:bg-slate-100 transition-colors rounded-lg">
      <div className="flex flex-row w-full flex-wrap">
        <span className="grow-1 self-center px-4">{name}</span>
        <div className="h-10">
          <Tooltip
            title={locked ? 'You cannot remove this item' : 'Remove'}
            placement="left"
          >
            {/* This span is required to ensure the locked tooltip shows when the IconButton is disabled */}
            <span>
              <IconButton
                aria-label="remove"
                className="self-center"
                onClick={() => remove(index, id)}
                disabled={locked}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
    // <div className="flex flex-row items-center rounded-md bg-slate-300 p-2">
    //   <div className="flex flex-col">
    //     <div>
    //       <h4 className="mb-1 bg-slate-300 text-xl font-bold text-black">
    //         {name}
    //       </h4>
    //     </div>
    //   </div>
    //   <button
    //     className="ml-auto disabled:hidden"
    //     type="button"
    //     onClick={() => remove(index, id)}
    //     disabled={locked}
    //   >
    //     remove
    //   </button>
    // </div>
  );
};

export default CollaboratorListItem;
