// This optional code is used to register a service worker.
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
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
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
  const swUrl = `/service-worker-test.js`;

  if (isLocalhost) {
    // This is running on localhost. Let's check if a service worker still exists or not.
    checkValidServiceWorker(swUrl, config);

    // Add some additional logging to localhost, pointing developers to the
    // service worker/PWA documentation.
    navigator.serviceWorker.ready.then(() => {
      console.log(
        'This web app is being served cache-first by a service ' +
        'worker. To learn more, visit http://bit.ly/CRA-PWA',
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
        'BCBYn0w5rIQR9Vp3FzBI8CfbDfUS6YW5MBphX-Mj4uHT-HNZ007NyabOTFlPyAQFPyNoPCuqOxNWnBZYtA_gScw',
      ),
    };


    navigator.serviceWorker.ready.then(registration =>
      registration.pushManager.subscribe(subscribeOptions)
      .then(subscription => {
        const data = {
          subscription,
          browser: checkBrowser(),
          os: getOS(),
          language: getLang(),
          //TODO generate appID according ID of website
          appID: '5bfb8bed083d7b042f4dba59',
        };


        //TODO change URL
        fetch(`http://192.168.2.2:5000/api/subscribe`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json',
          },
        });
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
              'tabs for this page are closed. See http://bit.ly/CRA-PWA.',
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
      'No internet connection found. App is running in offline mode.',
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
  .replace(/\-/g, '+')
  .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function checkBrowser() {
  // Opera 8.0+
  const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
  const isIE = !!document.documentMode;

// Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 68
  const isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
  const isBlink = (isChrome || isOpera) && !!window.CSS;
  return isOpera ? 'Opera' :
    isFirefox ? 'Firefox' :
      isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
          isIE ? 'IE' :
            isEdge ? 'Edge' :
              isBlink ? 'Blink' :
                'Don\'t know';
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

window.addEventListener('load', register);
