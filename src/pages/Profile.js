import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import ProfileFeed from '../components/Profile';
import React from 'react';

export default function Profile({ user, locations }) {

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  React.useEffect(() => {

    function handler() {

      console.log(`Window resize [${window.innerWidth/window.innerHeight}]`);

      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })

    }

    window.addEventListener('resize', handler);
    return _ => {
      window.removeEventListener('resize', handler)
    }

  })

  const desktop = (dimensions.width / dimensions.height) > 1.6;
  const tablet = (dimensions.width / dimensions.height) > 1.1;

  return (
    <div className={"App" + (!tablet ? ' mobile' : '') + (!desktop ? ' tablet' : '')}>
      {tablet ? <Sidebar locations={locations} user={user} tablet={tablet} /> : ''}
      <ProfileFeed locations={locations} user={user} tablet={desktop} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}
