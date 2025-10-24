import Header from '@src/components/header/BaseHeader';
import { ClubSearchComponent } from './ClubSearch';
import { getServerAuthSession } from '@src/server/auth';

type Params = {
  searchParams: { [key: string]: string | undefined };
};

const clubSearch = async (props: Params) => {
  const { searchParams } = props;
  const userSearch = searchParams['search'] || '';
  const session = await getServerAuthSession();

  return (
    <main className="md:pl-72">
      <div>
        <Header />
        <ClubSearchComponent userSearch={userSearch} session={session} />
      </div>
    </main>
  );
};

export default clubSearch;
