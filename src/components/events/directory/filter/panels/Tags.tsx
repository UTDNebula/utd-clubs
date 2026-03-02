import { memo } from 'react';
import Panel from '@src/components/common/Panel';
import { EventFiltersSchema } from '@src/utils/eventFilter';
import ClubTagFilter from '../ClubTagFilter';
import { FilterPanelProps, panelProps, setParams } from '../utils';

export type TagsPanelFields = Pick<EventFiltersSchema, 'tags'>;

export default memo(function TagsPanel(
  props: FilterPanelProps<TagsPanelFields>,
) {
  const tags = props.filters.tags;

  return (
    <Panel
      heading={
        <>
          Tags
          {tags.length > 0 && (
            <span className=" ml-2 text-base font-normal text-neutral-600 dark:text-neutral-400">
              ({tags.length})
            </span>
          )}
        </>
      }
      {...panelProps(props.backgroundHover)}
    >
      <ClubTagFilter
        value={tags}
        onChange={(newValue) => {
          setParams((params) => {
            if (newValue.length) {
              params.set('tags', newValue.join(','));
            } else {
              params.delete('tags');
            }
          });
        }}
        label=""
        vertical
      />
    </Panel>
  );
});
