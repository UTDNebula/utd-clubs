import {
  AboutIcon,
  EventsIcon,
  FeedbackIcon,
  HomeIcon,
  type IconType,
  CommunityIcon,
  AdminIcon,
} from '../icons/Icons';

export const mainCats = ['Home', 'My Community', 'Events'] as const;
export const moreCats = ['About', 'Feedback'] as const;
export const personalCats = ['Manage Clubs', 'Admin'] as const;

export type allCats =
  | (typeof mainCats)[number]
  | (typeof moreCats)[number]
  | (typeof personalCats)[number];
export const IconMap: {
  [key in allCats[number]]: IconType;
} = {
  Home: HomeIcon,
  'My Community': CommunityIcon,
  Events: EventsIcon,
  About: AboutIcon,
  Feedback: FeedbackIcon,
  'Manage Clubs': HomeIcon,
  Admin: AdminIcon,
};

export const routeMap: {
  [key in allCats[number]]: string;
} = {
  Home: '/',
  'My Community': '/community',
  Events: '/events',
  About: '/about',
  Feedback: '/feedback',
  'Manage Clubs': '/manage',
  Admin: '/admin',
};
