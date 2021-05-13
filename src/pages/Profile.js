import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import ProfileFeed from '../components/Profile';

export default function Profile({ user }) {

  const desktop = useMediaQuery({ minWidth: 1440 });
  const tablet = useMediaQuery({ minWidth: 1265 });
  // const phone = useMediaQuery({ minWidth: 800 });
  
  return (
    <div className="App">
      {tablet ? <Sidebar user={user} tablet={tablet} /> : ''}
      <ProfileFeed user={user} />
      {desktop ? <Actions user={user} /> : ''}
    </div>
  );
}