import Header from '@src/components/header/BaseHeader';
import { ClubSearchComponent } from './ClubSearch';

type Params = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const clubSearch = async (props: Params) => {
  const searchParams = await props.searchParams;
  const userSearch = searchParams['search'] || '';

  return (
    <main className="md:pl-72">
      <div>
        <Header />
        <ClubSearchComponent userSearch={userSearch} />
      </div>
    </main>
  );
};

export default clubSearch;
