import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import Feed from '../components/Feed';

export default function Dashboard({ user }) {

  const desktop = useMediaQuery({ minWidth: 1440 });
  const tablet = useMediaQuery({ minWidth: 1265 });
  // const phone = useMediaQuery({ minWidth: 800 });
  
  return (
    <div className={"App" + (!tablet ? ' mobile' : '')}>
      {tablet ? <Sidebar user={user} tablet={tablet} /> : ''}
      <Feed user={user} />
      {desktop ? <Actions user={user} /> : ''}
    </div>
  );
}