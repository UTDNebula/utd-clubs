import Header from '@src/components/header/BaseHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Jupiter',
  description: 'About Jupiter',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/about',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/about',
    description: 'About Jupiter',
  },
};

const About = () => {
  const teamMembers = [
    { name: 'Ethan Bickel', position: 'Project Lead' },
    { name: 'Braeden Kotko', position: 'Engineer' },
    { name: 'Connor Harris', position: 'Engineer' },
    { name: 'Jonathan Le', position: 'Engineer' },
    { name: 'Alex Vazquez', position: 'Engineer' },
    { name: 'Ishaan Gupta', position: 'Engineer' },
    { name: 'Ritvik Thota', position: 'Engineer' },
  ];
  const recruits = [
    { name: 'Jordan Joelson', position: 'Engineer' },
    { name: 'Mansi Cherukupally', position: 'Engineer' },
    { name: 'Aryav Rastogi', position: 'Engineer' },
    { name: 'Sreevasan Siasubramanian', position: 'Engineer' },
    { name: 'Ninad Sudarsanam', position: 'Engineer' },
    { name: 'Shivesh Gupta', position: 'Engineer' },
    { name: 'Natalia Sekulic', position: 'Engineer' },
    { name: 'Mamoun Elmamoun', position: 'Engineer' },
    { name: 'Chloe Alzaga', position: 'Engineer' },
    { name: 'Joshua Perez', position: 'Engineer' },
    { name: 'Ankith Ganji', position: 'Engineer' },
    { name: 'Valeria Gallardo', position: 'Designer' },
    { name: 'Waseef Kabir', position: 'Designer' },
    { name: 'Ved Mahant', position: 'Designer' },
  ];
  return (
    <main className="h-full md:pl-72">
      <Header />
      <div className="mx-6 h-full">
        <div className="rounded-lg bg-slate-100 p-8 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-slate-500">
            About Jupiter
          </h2>

          <p className="mt-2 space-y-4 text-sm font-light text-slate-500">
            Jupiter is a platform being developed by nebula labs in order to
            help students find organizations and events on and around campus.
            <br />
            You&apos;re able to track organizations you&apos;re interested in,
            find new organizations, and keep up to date on events you want to
            attend.
            <br />
            For organizations we offer a better way to keep your info up to
            date, and for people well suited for your organization to find out
            about you and your events.
          </p>
          <p className="mt-2 space-y-4 text-sm font-light text-slate-500">
            If you&apos;re interested in contributing to Jupiter check out the{' '}
            <a
              href="https://discord.utdnebula.com/"
              className="text-blue-primary hover:underline"
            >
              Nebula Discord
            </a>
            , or our{' '}
            <a
              href="https://github.com/UTDNebula/jupiter"
              className="text-blue-primary hover:underline"
            >
              Github
            </a>
          </p>
        </div>
        <div className="mt-16 py-3">
          <h1 className="mb-10 text-center text-3xl font-bold text-slate-500">
            Our Team
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {teamMembers.map((member, key) => (
              <div
                key={key}
                className="rounded-lg bg-slate-100 p-5 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <h2 className="mb-2 text-xl font-medium text-slate-500">
                  {member.name}
                </h2>
                <h3 className="text-lg text-slate-500">{member.position}</h3>
              </div>
            ))}
          </div>
          <div className="mt-16 py-3">
            <h1 className="mb-10 text-center text-3xl font-bold text-slate-500">
              Recruits
            </h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {recruits.map((member, key) => (
                <div
                  key={key}
                  className="rounded-lg bg-slate-100 p-5 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <h2 className="mb-2 text-xl font-medium text-slate-500">
                    {member.name}
                  </h2>
                  <h3 className="text-lg text-slate-500">{member.position}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
