import store from 'store';

export default () => !(!store.get('token') || !store.get('expiresAt') || store.get('expiresAt') < Math.floor(Date.now() / 1000));