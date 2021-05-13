import { useMediaQuery } from 'react-responsive';

import Sidebar from '../components/Sidebar';
import Actions from '../components/Actions';
import Content from '../components/Content';

export function Dashboard({ user }) {

  const desktop = useMediaQuery({ minWidth: 1440 });
  const tablet = useMediaQuery({ minWidth: 1265 });
  // const phone = useMediaQuery({ minWidth: 800 });
  
  return (
    <div className="App">
      {tablet ? <Sidebar user={user} tablet={tablet} /> : ''}
      <Content user={user} />
      {desktop ? <Actions user={user} /> : ''}
    </div>
  );
}