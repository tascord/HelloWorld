import RestObject from "../Object";
import User from "../User";

export const Object = new RestObject('user', []);

// Create a user
Object.put = (_user, data) => new Promise((resolve) => {
    const { username, password, email } = data;

    if (username === undefined) throw new Error('Username is required');
    if (password === undefined) throw new Error('Password is required');
    if (email === undefined) throw new Error('Email is required');

    resolve({ token: User.create(username, email, password).to_token() });
});

// Login
Object.post = (_user, data) => new Promise((resolve) => {
    const { username, password } = data;

    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');

    const user = User.from_username(username);
    if (!user.password_matches(password)) throw new Error('Invalid password');

    resolve({ token: user.to_token() });

})