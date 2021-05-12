import Sidebar from './components/Sidebar';
import { useMediaQuery } from 'react-responsive';
import Actions from './components/Actions';

const user = {
  username: "tascord",
  id: "tascord",
  followers: [1, 2, 3, 4, 5],
  following: [
    {
      username: "steve",
      id: "st3ve",
      followers: [1, 2, 3, 4, 5],
      following: [1, 2, 3],
      live: false,
      avatar: 'https://cdn.discordapp.com/avatars/205643558210895872/a_362b1797c2b4360204377fec24809ed8.png?size=2048'
    },
    {
      username: "Conroy VII",
      id: "conny_the_fith",
      followers: [1, 2, 3, 4, 5],
      following: [1, 2, 3],
      live: true,
      avatar: 'https://cdn.discordapp.com/avatars/325444141469270016/951d78ecb1d63e2a995d989ed4576f9b.png?size=2048'
    }
  ],
  live: false,
  avatar: 'https://cdn.discordapp.com/avatars/205811939861856257/f4b880e557ae7c6e4442843ed21ecc12.png?size=2048'
}

export function Dashboard() {

  const desktop = useMediaQuery({ minWidth: 1440 });
  const tablet = useMediaQuery({ minWidth: 1265 });
  const phone = useMediaQuery({ minWidth: 800 });

  return (
    <div className="App">
      {tablet ? Sidebar(user, tablet) : ''}
      <div className="pane content">
        <div className="header"></div>
      </div>
      {desktop ? Actions(user) : ''}
    </div>
  );
}