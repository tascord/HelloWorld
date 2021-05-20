import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import ProfileFeed from '../components/Profile';

export default function Profile({ user, locations }) {

  const { outerWidth, outerHeight } = window;

  const desktop = (outerWidth / outerHeight) > 1.6;
  const tablet = (outerWidth / outerHeight) > 1.1;
  
  return (
    <div className={"App" + (!tablet ? ' mobile' : '')}>
      {tablet ? <Sidebar locations={locations} user={user} tablet={tablet} /> : ''}
      <ProfileFeed locations={locations} user={user} tablet={desktop} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}