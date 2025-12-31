import Panel from '@src/components/form/Panel';
import { SelectClub } from '@src/server/db/models';

type ClubsProps = {
  clubs: SelectClub[];
};

export default function Clubs({ clubs }: ClubsProps) {
  return <Panel heading="Joined Clubs">Hi!</Panel>;
}
