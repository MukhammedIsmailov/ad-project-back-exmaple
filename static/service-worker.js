// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432

//TODO change url when upload to staging
const API_URL = 'https://notification.dunice.net/api';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
      checkSubscriberIP()
  );
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let windowClient of windowClients) {
      // Force open pages to refresh, so that they have a chance to load the
      // fresh navigation response from the local dev server.
      windowClient.navigate(windowClient.url);
    }
  });
});

self.addEventListener('push', (e) => {
  if (e.data) {
    e.waitUntil(self.registration.pushManager.getSubscription()
        .then(subscription => {
          const optionsForFetch = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              statisticAction: 'delivered'
            })
          };
          if(e.data.json().data.notificationID)
            optionsForFetch.body = JSON.stringify({
              statisticAction: 'delivered',
              notificationID: e.data.json().data.notificationID
            });
          if(e.data.json().data.campaignID){
            const subscriberID = e.data.json().data.subscriberID;
            if(subscriberID){
              checkSubscriberIP(subscriberID);
            }
            optionsForFetch.body = JSON.stringify({
              statisticAction: 'delivered',
              subscriberIP: e.data.json().data.subscriberIP,
              campaignID: e.data.json().data.campaignID
            });
          }
          return fetch(API_URL + '/statistic', optionsForFetch)
              .then(() => {
                const {
                  title,
                  body,
                  image,
                  data,
                  icon
                } = e.data.json();
                return self.registration.showNotification(title, {
                  body,
                  data,
                  image,
                  icon
                })
              });
        })
        .catch(err => console.log('--> err', err)))
  }
});

self.addEventListener("notificationclick", function (e) {
  const url = e.notification.data.redirectUrl;

  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window" })
      .then(() => {
        const optionsForFetch = {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
        };
        if(e.notification.data.notificationID)
          optionsForFetch.body = JSON.stringify({
            statisticAction: 'clicked',
            notificationID: e.notification.data.notificationID
          });
        if(e.notification.data.campaignID){
          const subscriberID = e.notification.data.subscriberID;
          if(subscriberID){
            checkSubscriberIP(subscriberID);
          }
          optionsForFetch.body = JSON.stringify({
            statisticAction: 'clicked',
            subscriberIP: e.notification.data.subscriberIP,
            campaignID: e.notification.data.campaignID
          });
        }
        return fetch(API_URL + '/statistic', optionsForFetch)
      })
      .then(function (t) {
        for (let e = 0; e < t.length; e++) {
          let i = t[e];
          if ("/" === i.url && "focus" in i) return i.focus()
        }
        if (clients.openWindow) return clients.openWindow(url)
      }))
});

function checkSubscriberIP(subID) {
  let dbPromise = indexedDB.open('SubscriberDatabase', 1), db, tx, store, index;

  dbPromise.onupgradeneeded = function(e) {
    let db = dbPromise.result,
        store = db.createObjectStore("DataStore", {keyPath: "id", autoIncrement: true})
    index = store.createIndex("id", "id", {unique: false})
  };

  dbPromise.onerror = function(e) {
    console.log("There was an error: " + e.target.errorCode);
  };

  dbPromise.onsuccess = function(e) {
    getSubscriberIP().then(subscriberIP => {
      db = dbPromise.result;
      tx = db.transaction('DataStore', 'readwrite');
      store = tx.objectStore("DataStore");
      index = store.index("id");

      db.onerror = function (e) {
        console.log("There was an error: " + e.target.errorCode);
      };

      let getSubscriberID = store.get(1);
      let getSubscriberIP = store.get(2);
      let oldSubscriberIP = null;

      getSubscriberID.onsuccess = function() {
        const subscriberID = getSubscriberID.result;

        getSubscriberIP.onsuccess = function() {
          oldSubscriberIP = getSubscriberIP.result;

          if(oldSubscriberIP){
            if(oldSubscriberIP.value !== subscriberIP){
              store.put({id: 2, dataText: "IP", value: subscriberIP});
              if(subscriberID && subscriberID.value){
                const updateIpUrl = API_URL + '/update-ip?ip=' + subscriberIP + '&id=' + subscriberID.value;
                fetch(updateIpUrl)
              } else {
                if(subID){
                  store.put({id: 1, dataText: "ID", value: subID});
                  const updateIpUrl = API_URL + '/update-ip?ip=' + subscriberIP + '&id=' + subID;
                  fetch(updateIpUrl)
                }
              }
            }
          } else {
            store.put({id: 2, dataText: "IP", value: subscriberIP});
          }
        }
      };

      tx.oncomplete = function() {
        db.close();
      }
    })
  }
}

setInterval(() => {
  checkSubscriberIP();
}, 43200000); // 12 hours

function getSubscriberIP () {
  return fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((responseJSON) => {
        return responseJSON.ip;
      });
}
