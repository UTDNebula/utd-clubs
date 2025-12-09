'use client';

type Props = {
  date: string;
};

const TimeComponent = (props: Props) => {
  const date = new Date(props.date);
  const dateString = date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <p className="text-sm text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
      {dateString}
    </p>
  );
};

export default TimeComponent;
