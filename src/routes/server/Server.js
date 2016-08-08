/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Server.css';
import fetch, { Request, Headers, Response } from '../../core/fetch';

function Server({ user, serverId, prefix }, context) {
  /* eslint-disable no-console */
  console.log(Request.headers);
  console.log(Response);
  console.log(new Headers({ 'Content-Type': 'application/json' }));
  console.log(context);
  /* eslint-enable no-console */
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
  context.setTitle(guild.name);
  const handleState = (event) => {
    fetch(`/api/v1/prefix/${guild.id}`, {
      method: 'PUT',
      header: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ prefix: event.target.value }),
    });
  };
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>{guild.name}'s Settings</h1>
        Prefix: <input
          type="text" name="prefix" defaultValue={prefix} onChange={handleState}
        />
        <p>Prefix: {prefix}</p>
      </div>
    </div>
  );
}

Server.propTypes = {
  user: PropTypes.object,
  serverId: PropTypes.string,
  prefix: PropTypes.array,
};

Server.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Server);
