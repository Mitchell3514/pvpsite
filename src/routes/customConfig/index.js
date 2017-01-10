/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import CustomConfig from './CustomConfig';
import fetch from '../../core/fetch';

let title = 'Admin Panel';
let description = 'Server admin panel';

export default {

  path: '/server/:serverId/:urlLocation*?',
  auth: true,

  async action({ user, headers }, params) {
    console.log(params);
    if (!user) return { redirect: `/login/server/${params.serverId}` };

    const options = {
      method: 'get',
      credentials: 'include',
    };
    if (headers) {
      options.headers = headers;
    }

    let settingsMapResp;
    try {
      settingsMapResp = await fetch(`/api/v1/settings/${params.serverId}`, options);
    } catch (error) {
      return { redirect: `/login/server/${params.serverId}/${params.urlLocation}`};
    }

    let settingsMap;
    if (settingsMapResp.status === 200) {
      settingsMap = (await settingsMapResp.json());
    }

    let prefixResp;
    try {
      prefixResp = await fetch(`/api/v1/prefix/${params.serverId}`, options);
    } catch (error) {
      console.error('prefix Resp caught', error);
    }

    let prefix;
    if (prefixResp.status === 200) {
      prefix = (await prefixResp.json()).prefix;
    }

    const guild = user.guilds.find(serverGuild => params.serverId === serverGuild.id);

    if (!guild) return { redirect: `/login/server/${params.serverId}` };

    title = `${guild.name}'s settings`;
    description = `Admin panel of ${guild.name}`;

    return {
      title,
      description,
      component: <CustomConfig
        title={title}
        guild={guild}
        user={user}
        serverId={params.serverId}
        prefix={prefix}
        urlLocation={params.urlLocation}
        settingsMap={settingsMap}
      />,
    };
  },
};
