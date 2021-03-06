
const SW_VERSION = '3.19';
const SW_MV = SW_VERSION.split('.')[0]; // major version number
const SW_ACTIVE = true;
const SW_LOG_PREFIX = 'SW' + SW_VERSION + ' --> ';
const SW_CACHE = 'memory' + SW_MV;

const BASEPATH = '/memory/' + SW_MV + '/';
const ITEMSTRING = 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra';
const FILES = get_pic_names(ITEMSTRING).concat([
        BASEPATH + 'angular-animate.min.js',
        BASEPATH + 'angular-aria.min.js',
        BASEPATH + 'angular-touch.js',
        BASEPATH + 'angular.min.js',
        BASEPATH + '../favicon.ico',
        BASEPATH,
        BASEPATH + 'index.html', 
        BASEPATH + 'launcher-icon.png', 
        BASEPATH + 'launcher-icon-2x.png', 
        BASEPATH + 'launcher-icon-3x.png', 
        BASEPATH + 'launcher-icon-4x.png', 
        BASEPATH + 'main.css', 
        BASEPATH + 'main.js',
        // BASEPATH + 'manifest.json',
    ]);

if (SW_ACTIVE) {
    console.log(SW_LOG_PREFIX + 'ServiceWorker active.');

    self.addEventListener('install', event => {
        caches.open(SW_CACHE).then(cache => cache.addAll(FILES));
        self.skipWaiting();
    });

    self.addEventListener('activate', event => {
        console.log(SW_LOG_PREFIX + 'ServiceWorker activate.');
    });

    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request) || fetch(event.request));
    });

} else {
    console.log(SW_LOG_PREFIX + 'ServiceWorker turned OFF.');
}

function get_pic_names(itemstring) {
    const li = itemstring.split(' ');
    let li2 = [];
    for (let i=0; i<li.length; i++) {
        li2.push(BASEPATH + 'pics/' + li[i] + '-1.jpg');
        li2.push(BASEPATH + 'pics/' + li[i] + '-2.jpg');
    }
    return li2;
}