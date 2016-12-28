
const SW_VERSION = '0.11';
const SW_ACTIVE = true;
const SW_LOG_PREFIX = 'SW ' + SW_VERSION + ' --> ';
const SW_CACHE = 'memory3_' + SW_VERSION;

const ITEMSTRING = 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra';
const FILES = [
        '/memory3/', 
        '/memory3/index.html', 
        '/memory3/main.css', 
        '/memory3/main.js',
        '/memory3/angular.min.js',
        '/memory3/angular-animate.min.js',
        '/memory3/angular-aria.min.js',
        '/memory3/angular-touch.js',
    ].concat(get_pic_names(ITEMSTRING));

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'ServiceWorker active.');

    self.addEventListener('install', event => {
        caches.open(SW_CACHE).then(cache => cache.addAll(FILES));
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX + 'ServiceWorker activate.');
    });

    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request));
    });

} else {
    console.log(SW_LOG_PREFIX + 'ServiceWorker turned OFF.');
}

function get_pic_names(itemstring) {
    const li = itemstring.split(' ');
    let li2 = [];
    for (let i=0; i<li.length; i++) {
        li2.push('pics/' + li[i] + '-1.jpg');
        li2.push('pics/' + li[i] + '-2.jpg');
    }
    return li2;
}