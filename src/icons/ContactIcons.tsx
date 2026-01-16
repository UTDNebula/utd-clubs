import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SvgIcon from '@mui/material/SvgIcon';

interface IconProps {
  className?: string;
}

export const Discord = ({ className }: IconProps) => {
  return (
    <SvgIcon className={className ?? ''}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.98 5.17c-1.91 -1.538 -4.934 -1.798 -5.062 -1.808a0.476 0.476 0 0 0 -0.474 0.282c-0.008 0.011 -0.073 0.163 -0.146 0.4 1.264 0.213 2.816 0.642 4.221 1.514a0.48 0.48 0 1 1 -0.506 0.816C15.596 4.874 12.582 4.8 12 4.8s-3.598 0.075 -6.011 1.573a0.48 0.48 0 0 1 -0.506 -0.816C6.888 4.688 8.44 4.256 9.704 4.046c-0.073 -0.238 -0.139 -0.389 -0.144 -0.402a0.472 0.472 0 0 0 -0.477 -0.282c-0.13 0.01 -3.152 0.27 -5.088 1.829C2.982 6.126 0.96 11.592 0.96 16.32q0.001 0.128 0.064 0.238c1.394 2.452 5.203 3.094 6.071 3.122h0.014a0.48 0.48 0 0 0 0.389 -0.197l0.878 -1.208c-2.368 -0.611 -3.578 -1.65 -3.648 -1.712a0.48 0.48 0 0 1 0.636 -0.72c0.029 0.026 2.256 1.917 6.636 1.917 4.387 0 6.615 -1.898 6.638 -1.916a0.48 0.48 0 0 1 0.634 0.72c-0.07 0.062 -1.278 1.101 -3.647 1.712l0.878 1.207a0.48 0.48 0 0 0 0.389 0.197h0.014c0.868 -0.028 4.677 -0.67 6.072 -3.122a0.48 0.48 0 0 0 0.063 -0.238c0 -4.727 -2.023 -10.194 -3.06 -11.15M8.88 14.4C7.952 14.4 7.2 13.542 7.2 12.48s0.752 -1.92 1.68 -1.92 1.68 0.858 1.68 1.92 -0.752 1.92 -1.68 1.92m6.24 0c-0.928 0 -1.68 -0.858 -1.68 -1.92s0.752 -1.92 1.68 -1.92 1.68 0.858 1.68 1.92 -0.752 1.92 -1.68 1.92" />
      </svg>
    </SvgIcon>
  );
};
export const Twitch = ({ className }: IconProps) => {
  return (
    <SvgIcon className={className ?? ''}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="m3.75 1.5 -1.5 3.75v14.25h4.5v3h3l3 -3h3.75l5.25 -5.25V1.5Zm15.75 12 -3 3h-4.5l-3 3v-3h-3.75V3.75h14.25Z" />
        <path d="M15 6.703h2.25v6.047h-2.25zm-5.25 0h2.25v6.047h-2.25z" />
      </svg>
    </SvgIcon>
  );
};

const discordStyling =
  'text-[#5865f2] transition-colors group-hover:text-[#5865f2]/80';
const instagramStyling =
  'text-[#ff0069] transition-colors group-hover:text-[#ff0069]/60';
const twitterStyling =
  'text-[#14171a] dark:text-white transition-colors group-hover:text-[#14171a]/60 dark:text-white/80';
const facebookStyling =
  'text-[#1877f2] transition-colors group-hover:text-[#1877f2]/80';
const youtubeStyling =
  'text-[#ff0000] transition-colors group-hover:text-[#ff0000]/60';
const twitchStyling =
  'text-[#9146ff] transition-colors group-hover:text-[#9146ff]/80';
const linkedInStyling =
  'text-[#0a66c2] transition-colors group-hover:text-[#0a66c2]/80';

const genericStyling =
  'text-slate-600 dark:text-slate-400 transition-colors group-hover:text-slate-600/80 dark:group-hover:text-slate-400/80';

export const logo = {
  discord: <Discord className={discordStyling} />,
  instagram: <InstagramIcon className={instagramStyling} />,
  website: <WebIcon className={genericStyling} />,
  email: <AlternateEmailIcon className={genericStyling} />,
  twitter: <XIcon className={twitterStyling} />,
  facebook: <FacebookIcon className={facebookStyling} />,
  youtube: <YouTubeIcon className={youtubeStyling} />,
  twitch: <Twitch className={twitchStyling} />,
  linkedIn: <LinkedInIcon className={linkedInStyling} />,
  other: <LinkIcon className={genericStyling} />,
};
