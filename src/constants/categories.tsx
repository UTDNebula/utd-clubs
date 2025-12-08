import type { SvgIconComponent } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';

export const mainCats = ['Home', 'My Community', 'Events'] as const;
export const moreCats = ['About'] as const;
export const personalCats = ['Manage Clubs', 'Admin'] as const;

export type allCats =
  | (typeof mainCats)[number]
  | (typeof moreCats)[number]
  | (typeof personalCats)[number];
export const IconMap: {
  [key in allCats[number]]: SvgIconComponent;
} = {
  Home: HomeIcon,
  'My Community': PeopleIcon,
  Events: EventIcon,
  About: HelpIcon,
  'Manage Clubs': HomeIcon,
  Admin: GavelIcon,
};

export const routeMap: {
  [key in allCats[number]]: string;
} = {
  Home: '/',
  'My Community': '/community',
  Events: '/events',
  About: 'https://www.utdnebula.com/projects/clubs',
  'Manage Clubs': '/manage',
  Admin: '/admin',
};
