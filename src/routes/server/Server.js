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
import ServerMenu from '../../components/ServerMenu';
import PrefixField from '../../components/PrefixField';

function Server({ user, serverId, prefix }, context) {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
  if (!guild) {
    context.setTitle('Guild Not Found');
    return (<div><h2>Guild {serverId} Not Found</h2>Your Guild Could not be found</div>);
  }
  context.setTitle(guild.name);
  context.setDescription(`Admin panel of ${guild.name}`);
  return (
    <div>
      <ServerMenu className={s.nav} user={user} serverId={serverId} page="server" />
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>{guild.name}'s Settings</h1>
          {(prefix ? <div>Prefix: <PrefixField
            serverId={serverId}
            prefix={prefix}
          />
          </div>
            : '')}
        </div>
      </div>
    </div>
  );
}

Server.propTypes = {
  user: PropTypes.object.isRequired,
  serverId: PropTypes.string.isRequired,
  prefix: PropTypes.array,
};

Server.contextTypes = { setTitle: PropTypes.func.isRequired, setDescription: PropTypes.func.isRequired };

export default withStyles(s)(Server);
