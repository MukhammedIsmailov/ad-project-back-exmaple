const fs = require('fs');
const path = require('path');

/**
 * Insert ID of website into template,
 * save service-worker.js,
 * return URL
 **/
function generateSWRegistrator(id) {
  const swRegistrator = `// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

function register(config) {

  // The URL constructor is available in all browsers that support SW.
  // const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  // if (publicUrl.origin !== window.location.origin) {
  //   // Our service worker won't work if PUBLIC_URL is on a different origin
  //   // from what our page is served on. This might happen if a CDN is used to
  //   // serve assets; see https://github.com/facebook/create-react-app/issues/2374
  //   return;
  // }


  /**
   * swURL it's service worker file which user should add to the directory in a server with website
   * because service worker should have the same origin.
   */
  const swUrl = \`/service-worker.js\`;

  if (isLocalhost) {
    // This is running on localhost. Let's check if a service worker still exists or not.
    checkValidServiceWorker(swUrl, config);

    // Add some additional logging to localhost, pointing developers to the
    // service worker/PWA documentation.
    navigator.serviceWorker.ready.then(() => {
      console.log(
        'This web app is being served cache-first by a service ' +
        'worker. To learn more, visit http://bit.ly/CRA-PWA'
      );
    });
  } else {
    // Is not localhost. Just register service worker
    registerValidSW(swUrl, config);
  }

}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          '${process.env.VAPID_PUBLIC_KEY}'
        )
      };

      navigator.serviceWorker.ready.then(registration =>
        registration.pushManager.subscribe(subscribeOptions)
          .then(subscription => {
            const data = {
              subscription,
              appID: '${id}',
              browser: checkBrowser(),
              os: getOS(),
              language: getLang(),
              ua: window.navigator.userAgent
            };
  
            fetch(\`${process.env.BASE_URL}api/subscribe\`, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'content-type': 'application/json'
              }
            }).then(res => res.json())
              .then(resJson => saveDataToIndexed(resJson.data));
          }));
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function checkBrowser() {
  var ua = navigator.userAgent,
    tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\\/))\\/?\\s*(\\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\\brv[ :]+(\\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\\b(OPR|Edge)\\/(\\d+)/);
    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\\/(\\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
}

function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }
  return os;
}

function getLang() {
  if (navigator.languages)
    return navigator.languages[0];
  else
    return navigator.language;
}

if ('serviceWorker' in navigator) {
  window.addEventListener("load", register);
}

function saveDataToIndexed (subscriberData) {
  const {subscriberID, subscriberIP} = subscriberData;

  let dbPromise = indexedDB.open('SubscriberDatabase', 1), db, tx, store, index;

  dbPromise.onupgradeneeded = function(e) {
    let db = dbPromise.result,
      store = db.createObjectStore("DataStore", {keyPath: "id", autoIncrement: true})
      index = store.createIndex("id", "id", {unique: false})
  }

  dbPromise.onerror = function(e) {
    console.log("There was an error: " + e.target.errorCode);
  }

  dbPromise.onsuccess = function(e) {
    db = dbPromise.result;
    tx = db.transaction('DataStore', 'readwrite');
    store = tx.objectStore("DataStore");
    index = store.index("id");

    db.onerror = function (e) {
      console.log("There was an error: " + e.target.errorCode);
    }

    store.put({id: 1, dataText: "ID", value: subscriberID});
    store.put({id: 2, dataText: "IP", value: subscriberIP});

    tx.oncomplete = function() {
      db.close();
    }
  }
}
`;
  const url = `${process.env.BASE_URL}public/javascripts/swRegistrators/${id}.js`;
  fs.writeFileSync(path.resolve(__dirname, `../public/javascripts/swRegistrators/${id}.js`), swRegistrator, 'utf8', (err) => console.log('--> err', err));
  return url;
}

module.exports = generateSWRegistrator;
