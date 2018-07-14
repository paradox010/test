console.log('__DEV__：', __DEV__);
if (__DEV__ === 'dev') {
    module.exports = require('./conf.dev');
} else {
    module.exports = require('./conf.prod');
}
