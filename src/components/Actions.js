export default function Actions({user}) {

    return (
        <div className="pane actions">
            <div className="header">
                <img alt="Avatar" src={user.avatar}></img>
            </div>
            <div className="panel profile-mini">
                <div className="name" onClick={() => window.location.pathname = `/profile/${user.id}`}>
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
            <div className="panel">
                <h2>Ready to stream?</h2>
                <button className="red">Go live</button>
            </div>
        </div>
    )

}