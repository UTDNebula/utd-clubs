import Link from 'next/link';
import Panel from '@src/components/common/Panel';

const Resources = () => {
  return (
    <Panel heading="Resources">
      <div className="flex flex-col gap-2 px-2">
        <ul className="prose prose-slate dark:prose-invert prose-a:text-royal dark:prose-a:text-cornflower-300 prose-sm md:prose-base">
          <li>
            Support
            <ul>
              <li>
                <Link href="https://discord.utdnebula.com/" target="_blank">
                  Nebula Labs Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/utdnebula/"
                  target="_blank"
                >
                  Nebula Labs Instagram
                </Link>
              </li>
            </ul>
          </li>
          <li>
            Marketing, Funding, and the Student Organization Manual
            <ul>
              <li>
                <Link href="https://soc.utdallas.edu/" target="_blank">
                  Student Organization Center (SOC)
                </Link>
              </li>
              <li>
                <Link
                  href="https://engineering.utdallas.edu/engage/students/student-organization/"
                  target="_blank"
                >
                  Jonsson School Student Organizations
                </Link>
              </li>
              <li>
                <Link href="https://signage.utdallas.edu/" target="_blank">
                  Digital Signage
                </Link>
              </li>
            </ul>
          </li>
          <li>
            Room Booking
            <ul>
              <li>
                <Link
                  href="https://www.aaiscloud.com/UTXDallas/logon.aspx?ReturnUrl=%2futxdallas%2fcalendars%2fdailygridcalendar.aspx"
                  target="_blank"
                >
                  Astra
                </Link>
              </li>
              <li>
                <Link
                  href="https://east.mymazevo.com/main-home"
                  target="_blank"
                >
                  Mazevo
                </Link>
              </li>
              <li>
                <Link href="https://rooms.utdnebula.com/" target="_blank">
                  UTD Rooms
                </Link>
                : If you missed the deadline to book through the above
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </Panel>
  );
};

export default Resources;
