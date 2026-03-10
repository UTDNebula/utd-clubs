import { memo } from 'react';
import z from 'zod';
import Panel from '@src/components/common/Panel';
import {
  EventFiltersSchema,
  eventLocationFilterEnum,
} from '@src/utils/eventFilter';
import FilterList, { FilterListItem } from '../FilterList';
import { FilterPanelProps, panelProps, setParams } from '../utils';

export type LocationPanelFields = Pick<
  EventFiltersSchema,
  'location' | 'locationExclude'
>;

export default memo(function LocationPanel(
  props: FilterPanelProps<LocationPanelFields>,
) {
  const location = props.filters.location;
  const locationExclude = props.filters.locationExclude;

  return (
    <Panel heading="Location" {...panelProps(props.backgroundHover)}>
      <FilterList
        options={
          [
            { label: 'On-Campus', value: 'on-campus' },
            { label: 'Off-Campus', value: 'off-campus' },
            { label: 'Online', value: 'online' },
            { label: 'Hybrid', value: 'hybrid' },
          ] satisfies FilterListItem<z.infer<typeof eventLocationFilterEnum>>[]
        }
        type="checkbox"
        enableExclusion
        selectedValues={location}
        excludedValues={locationExclude}
        onChange={(newSelectedValues, newExcludedValues) => {
          setParams((params) => {
            if (newSelectedValues.length) {
              params.set('location', newSelectedValues.join(','));
            } else {
              params.delete('location');
            }
            if (newExcludedValues.length) {
              params.set('location!', newExcludedValues.join(','));
            } else {
              params.delete('location!');
            }
          });
        }}
      />
    </Panel>
  );
});
