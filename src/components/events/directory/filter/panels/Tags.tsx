import { memo } from 'react';
import Panel from '@src/components/common/Panel';
import { EventFiltersSchema } from '@src/utils/eventFilter';
import ClubTagFilter from '../ClubTagFilter';
import { FilterPanelProps, navigateWithParams, panelProps } from '../utils';

export type TagsPanelFields = Pick<EventFiltersSchema, 'tags'>;

export default memo(function TagsPane(
  props: FilterPanelProps<TagsPanelFields>,
) {
  const pathname = props.pathname;

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
          const params = new URLSearchParams(window.location.search);
          if (newValue.length) {
            params.set('tags', newValue.join(','));
          } else {
            params.delete('tags');
          }
          navigateWithParams(pathname, params);
        }}
        label=""
        vertical
      />
    </Panel>
  );
});
