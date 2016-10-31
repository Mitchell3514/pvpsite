import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Permissions.css';
import ServerMenu from '../../components/ServerMenu';
import fetch from '../../core/fetch';

function buildNode(nodes, value) {
  if (nodes.length === 0) return value;
  const key = nodes.splice(0, 1)[0];
  return { [key]: buildNode(nodes, value) };
}

function recursiveAdd(dataInput, node, value) {
  const data = dataInput;
  let key;
  if (node.length > 0) {
    key = node.shift();
  } else {
    return value;
  }
  if (data && data.hasOwnProperty(key)) {
    const mergedNodes = recursiveAdd(data[key], node, value);
    if (mergedNodes === null || (typeof mergedNodes === 'object' && Object.keys(mergedNodes).length === 0)) {
      delete data[key];
    } else {
      data[key] = mergedNodes;
    }
    return data;
  }
  if (value !== null && data !== null) {
    if (data === true || data === false || typeof data === 'string' || typeof data === 'number') {
      return { [key]: buildNode(node, value) };
    }
    data[key] = buildNode(node, value);
  }
  return data;
}

function generateNode(element, permsArray = []) {
  if (element) {
    if (element.id) {
      if (element.id === 'topLevelPermissionsId') {
        return permsArray;
      }
      permsArray.push(element.id);
    }
    generateNode(element.parentElement, permsArray);
  }
  return permsArray;
}

function toDivs(permissions, serverData, layer = 0) {
  if (typeof permissions !== 'object') {
    return permissions;
  }
  return (<div>{
    Object.keys(permissions).map((key, i) => {
      let label = key;
      let spanClassName;
      // let liClassName;
      const subNode = toDivs(permissions[key], serverData, layer + 1);
      let levelNode;
      switch (layer) {
        case 0:
          levelNode = s.channel;
          if (serverData && serverData.hasOwnProperty('channels') && key !== '*') {
            const channel = serverData.channels.find(c => c.id === key);
            if (channel && channel.hasOwnProperty('name')) {
              label = `#${channel.name}`;
            }
          }
          break;
        case 1:
          if (key[0] === 'u') {
            levelNode = s.user;
            if (serverData && serverData.hasOwnProperty('members') && key !== '*') {
              const userId = key.slice(1);
              const user = serverData.members.find(m => m.id === userId);
              if (user && user.hasOwnProperty('name')) {
                label = `User: ${user.name}`;
              }
            }
          } else {
            levelNode = s.group;
            if (serverData && serverData.hasOwnProperty('roles') && key !== '*') {
              const groupId = key.slice(1);
              const group = serverData.roles.find(g => g.id === groupId);
              if (group && group.hasOwnProperty('name')) {
                label = `Role: ${group.name}`;
              }
            }
          }
          break;
        case 2:
          levelNode = cx(s.nodeStart, s.node);
          break;
        default:
          levelNode = s.node;
      }
      if (typeof subNode === 'boolean') {
        spanClassName = (subNode === true) ? s.allowed : s.denied;
        // liClassName = s.permissions;
      } else {
        spanClassName = s.entry;
        // liClassName = s.permissionItem;
      }
      return (<div className={cx(spanClassName, levelNode)} key={i} id={key}>{label}{subNode}</div>);
    })
  }</div>);
}

class Permissions extends Component {
  // const avatarURL = `https://discordapp.com/api/users/85257659694993408/avatars/${user.avatar}.jpg`;
  static propTypes = {
    user: PropTypes.object,
    serverId: PropTypes.string,
    serverData: PropTypes.object,
    permissions: PropTypes.object,
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  clickHandler(proxy, nd, reactClick) {
    let server = this.state.permissions.server;
    let targetNode;
    if (reactClick) {
      targetNode = reactClick.explicitOriginalTarget;
    } else {
      targetNode = proxy.target;
    }
    server = recursiveAdd(server, generateNode(targetNode).reverse(), null);
    fetch(`/api/v1/permissions/${server.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(server),
    }).then((...args) => {
      this.setState({ permissions: { server } });
      console.log(...args);
    }).catch(error => {
      console.log(error);
      alert(error.toString());
    });
  }

  render() {
    const { user, serverId, permissions, serverData } = this.props;
    const context = this.context;

    try {
      const guild = user.guilds.find(serverGuild => serverId === serverGuild.id);
      context.setTitle(guild.name);

      if (!this.state) {
        this.state = {};
      }

      if (!this.state.permissions) {
        this.state.permissions = permissions;
      }

      const items = toDivs(this.state.permissions.server, serverData);

      return (
        <div>
          <ServerMenu className={s.nav} user={user} serverId={serverId} page="permissions" />
          <div className={s.root}>
            <div className={s.container}>
              <h1 className={s.title}>{guild.name}&#39;s Permissions</h1>
              <p>Click a Node to delete it (feature still in beta, refresh page before use).</p>{
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              }<div onClick={(i, j, k) => this.clickHandler(i, j, k)} id="topLevelPermissionsId">
                {items}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error(error);
    }
    return false;
  }
}

export default withStyles(s)(Permissions);
