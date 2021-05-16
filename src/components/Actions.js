export default function Actions({ user }) {

    return (
        <div className="pane actions">
            <div className="header">
                <img alt="Avatar" src={user.avatar}></img>
            </div>
            <div className="panel profile-mini">
                <div className="name" onClick={() => window.location.pathname = `/profile/${user.handle}`}>
                    <img alt="Avatar" src={user.avatar}></img>
                    <div className="text">
                        <h2>{user.username}</h2>
                        <h3>@{user.handle}</h3>
                    </div>
                </div>
                <div className="stats">
                    <span><b>{user.followers.length}</b> Followers</span>
                    <span><b>{user.following.length}</b> Following</span>
                </div>
            </div>
            <div className="panel heya">
                <h2>Heya, {user.username}</h2>
                <div className="buttons">
                    <button><i className="fas fa-comment"></i> Create a post</button>
                    <button className="red"><i className="fas fa-video"></i> Go live</button>
                </div>
            </div>
        </div>
    )

}