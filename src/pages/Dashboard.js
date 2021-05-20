import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import Feed from '../components/Feed';

export default function Dashboard({ user, locations }) {

  const { outerWidth, outerHeight } = window;

  const desktop = (outerWidth / outerHeight) > 1.6;
  const tablet = (outerWidth / outerHeight) > 1.1;
  
  return (
    <div className={"App" + (!tablet ? ' mobile' : '')}>
      {tablet ? <Sidebar locations={locations} user={user} tablet={tablet} /> : ''}
      <Feed locations={locations} user={user} tablet={desktop} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}