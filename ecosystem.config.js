module.exports = {
  apps: [{
    name: 'pixiv-cq',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false
  }]
}
