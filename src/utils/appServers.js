import store from 'store';

export const STATUS_OPTIONS = {
  UNKNOWN: 'Unknown',
  CONNECTED: 'Connected',
  DISCONNECTED: 'Disconnected',
}

export const getLastStatus = appServerId => {
  if (!store.get('appServers')) {
    store.set('appServers', {});
  }
  const appServers = store.get('appServers');
  if (!appServers[appServerId]) {
    appServers[appServerId] = STATUS_OPTIONS.UNKNOWN;
    store.set('appServers', appServers);
  }
  return store.get('appServers')[appServerId];
}

export const setLastStatus = (appServerId, status) => {
  const appServers = store.get('appServers');
  const now = new Date();
  const nowString = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`
  appServers[appServerId] = `${status} reported at ${nowString}`;
  store.set('appServers', appServers);
}

export const setLastStatusAsConnected = appServerId => setLastStatus(appServerId, STATUS_OPTIONS.CONNECTED);

export const setLastStatusAsDisconnected = appServerId => setLastStatus(appServerId, STATUS_OPTIONS.DISCONNECTED);