import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import ProfileFeed from '../components/Profile';

export default function Profile({ user, locations }) {

  const desktop = useMediaQuery({ minWidth: 1440 });
  const tablet = useMediaQuery({ minWidth: 1265 });
  // const phone = useMediaQuery({ minWidth: 800 });
  
  return (
    <div className={"App" + (!tablet ? ' mobile' : '')}>
      {tablet ? <Sidebar locations={locations} user={user} tablet={tablet} /> : ''}
      <ProfileFeed locations={locations} user={user} tablet={tablet} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}