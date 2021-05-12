import Sidebar from './components/Sidebar';

const user = {
  username: "tascord",
  id: "tascord",
  followers: [1, 2, 3, 4, 5],
  following: [1, 2, 3],
  avatar: 'https://cdn.discordapp.com/avatars/205811939861856257/f4b880e557ae7c6e4442843ed21ecc12.png?size=2048'
}

export default function Dashboard() {
  return (
    <div className="App">
      {Sidebar()}
      <div className="pane content">
        <div className="header"></div>
      </div>
      <div className="pane actions">
        <div className="header">
          <img alt="Avatar" src={user.avatar}></img>
        </div>
        <div className="panel profile-mini">
          <div className="name">
            <img alt="Avatar" src={user.avatar}></img>
            <div className="text">
              <h2>{user.username}</h2>
              <h3>@{user.id}</h3>
            </div>
          </div>
          <div className="stats">
            <span><b>{user.followers.length}</b> Followers</span>
            <span><b>{user.following.length}</b> Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

