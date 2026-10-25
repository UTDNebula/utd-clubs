'use client';

import { DataGrid, type DataGridProps, type GridSlots } from '@mui/x-data-grid';

type ListGridProps = Omit<DataGridProps, 'slots' | 'showToolbar'> & {
  toolbar?: GridSlots['toolbar'];
  footer?: GridSlots['footer'];
  showToolbar?: boolean;
};

const ListGrid = ({
  toolbar,
  footer,
  showToolbar = true,
  ...gridProps
}: ListGridProps) => {
  return (
    <DataGrid
      {...gridProps}
      slots={{
        ...(toolbar ? { toolbar } : {}),
        ...(footer ? { footer } : {}),
      }}
      showToolbar={showToolbar}
      className="rounded-lg"
      pageSizeOptions={[25]}
      disableRowSelectionOnClick
      disableRowSelectionExcludeModel
      hideFooterSelectedRowCount
    />
  );
};

export default ListGrid;
