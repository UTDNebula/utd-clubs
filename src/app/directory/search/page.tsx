import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { ClubSearchComponent } from './ClubSearch';

type Params = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const clubSearch = async (props: Params) => {
  const searchParams = await props.searchParams;
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
