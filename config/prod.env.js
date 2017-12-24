/**
 * 测试环境 true
 * 线上环境 false
 * */
const DEBUG = true;
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: DEBUG ? '"http://210.209.116.217:8084"' : '"https://api.fxrhs.com"'
}
