import React from 'react';
import PropTypes from 'prop-types';
import Request from '../helpers/Request';
import '../style/login.css';

export default function Login({ setToken, discord, locations }) {

  if (discord) {
    
    let code = window.location.search.replace(/(?:(?:&|\\?)code=((?:[a-z0-9])+))(?:&|)/gi, '$1').slice(1);
    Request(`${locations.api}/discord`, {code})
      .then(data => {
        
        let token = data.token.value;
        if(!token) return;
        
        console.log(`Logged in. Token: ${token}`);
        setToken(token);

        window.location.pathname = 'dashboard';

      })
      .catch((error) => {

        console.warn(error);
        setTimeout(() => {
          window.location.pathname = '/dashboard'
        }, 3500);

      });

    return (<></>);
  } else if(window.location.search) {
    window.location.search = '';
  }

  return (
    <form className="login">
      <div className="inner panel">
        <label className="Text">
          <h2>Welcome!</h2>
          <p>By continuing you accept our <b>Privacy Policy</b> and <b>Terms of Service</b></p>
        </label>
        <label>
          <a className="button discord" href={`https://discord.com/api/oauth2/authorize?client_id=844532797271703554&redirect_uri=${locations.self + '/discord'}&response_type=code&scope=identify`}>
            <img alt="Discord's Logo" src="/discord.png"></img>
           Login with Discord
         </a>
        </label>

      </div>
    </form>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}