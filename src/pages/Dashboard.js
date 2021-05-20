import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import Feed from '../components/Feed';
import React from 'react';

export default function Dashboard({ user, locations }) {

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
      <Feed locations={locations} user={user} tablet={desktop} />
      {desktop ? <Actions locations={locations} user={user} /> : ''}
    </div>
  );
}