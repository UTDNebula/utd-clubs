import { memo, useState } from 'react';
import Panel from '@src/components/common/Panel';
import { ClubTagEdit } from '@src/components/manage/form/ClubTagEdit';
import { FilterPanelBaseProps, panelProps } from '../utils';

export default memo(function TagsPane(props: FilterPanelBaseProps) {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <Panel heading="Tags" {...panelProps(props.backgroundHover)}>
      <ClubTagEdit
        value={tags}
        onChange={(newValue) => {
          setTags(newValue);
        }}
        onBlur={() => {}}
      />
    </Panel>
  );
});
