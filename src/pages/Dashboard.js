import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import Feed from '../components/Feed';

export default function Dashboard({ user, locations }) {

  const desktop = useMediaQuery({ minWidth: 1100 });
  const tablet = useMediaQuery({ minWidth: 900 });
  // const phone = useMediaQuery({ minWidth: 800 });
  
  return (
    <div className={"App" + (!tablet ? ' mobile' : '')}>
      {tablet ? <Sidebar locations={locations} user={user} tablet={tablet} /> : ''}
      <Feed locations={locations} user={user} tablet={desktop} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}