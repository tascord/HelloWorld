export default function Sidebar({user, tablet = false}) {

    return (
        <div className={"sidebar pane" + (tablet ? " tablet" : "")}>
            <div className="header">
                <h2><a href="/dashboard">Hello World</a></h2>
            </div>
            <div className="following">
                <h2>Following</h2>
                {
                    user.following.map(u => {

                        return (
                            <div className="panel user">
                                {u.live ? <div className="live-indicator" title="User is live"></div> : ''}
                                <img alt={"Avatar of " + u.username} src={u.avatar}></img>
                                <div className="text">
                                    <h2>{u.username}</h2>
                                    <h3>@{u.id}</h3>
                                </div>
                            </div>
                        )

                    })
                }
            </div>
        </div>
    );

}