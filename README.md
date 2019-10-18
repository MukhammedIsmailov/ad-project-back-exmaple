#Initialization

npm install - install node_modules
cp .env.example .env - to create env file with all required fields
install mongodb
change end-point in static service-worker.js
Create NGINX proxy_pass for end-points(only for production version)

location /api {
  proxy_set_header  Host $host;
  proxy_set_header  X-Real-IP $remote_addr;
  proxy_set_header  X-Forwarded-Proto https;
  proxy_set_header  X-Forwarded-For $remote_addr;
  proxy_set_header  X-Forwarded-Host $remote_addr;
  proxy_pass http://127.0.0.1:5000;
}

location /uploads {
  proxy_pass http://127.0.0.1:5000;
}

location /static {
  proxy_pass http://127.0.0.1:5000;
}

location /public {
  proxy_pass http://127.0.0.1:5000;
}



> Developer information for routes and its configuration.

# Routes
   ###1. Login
`POST /api/auth/login`
```javascript
const body = { email: string, password: string }
```

   ###2. Registration
`POST api/auth/register`
```javascript
const body = {
  fullName: String,
  email: String,
  password: String,
};
```
   ###3. Upload
`POST api/upload`

   ###4. User info
   4.1 Get user information
`GET api/user/profile?id=`

   4.2 Change user information
`POST api/user/profile`

```javascript
const body = {
  fullName: String,
  email: String,
  phone: String,
}
```
   ###5. Save website
`POST api/user/save-website`
```javascript
const body = {
  url: String,
  icon: String
}
```
   ###6. Get integration info for website
`GET api/user/website-integration-info?id=`

in the query id should past id of website

   ###7. Get common statistics for dashboard
`GET api/user/common-statistics`

   ###8. Get common notification statistics
`GET api/user/notification-statistics?group=day|week&period=month|week`

   ###9. Send push
`POST api/send-push`
```javascript
const body = {
  "id": "5bfd482330ee7716dcc0b897", //id of website
  "notification": {
    "title": "Awesome title!",
    "body": "the most awesome text of push",
    "image": String, // url for image
    "url": String, // url for redirect on notification click
    "delayedDate": String //ISO string

  },
  "filter": {
    "os": Array,
    "browser": Array,
    "language": Array,
    "subscriptionDate": Array,
    "region": Array
  },
}
```

   ###10. Delete website
`DELETE api/user/delete-website?id=`

in the query id should past id of website

   ###11. Get notifications
`GET  api/user/notifications`

   ###12. Get notification information by ID
`GET api/statistic/notification/:id`

   ###13. Get website information by ID
`GET api/statistic/website/:id`

```javascript
const response = {
        allSubscribers: website.subscribers.length,
        newSubscribersCount: Number,
        campaigns: website.notifications.length,
        unsubscribeCount: Number,
        dataForGraph: Array
}
```


   ###14. Change user password
`POST api/user/change-password`
```javascript
const body = {
  oldPassword: String,
  newPassword: String
}
```

###15. Change website information
`POST api/user/change-website-information?id=`
```javascript
const body = {
  icon: String
}
```

###16. Delete subscriber
`DELETE api/user/delete-subscriber?websiteId=&subscriberId=`

###17. Save new Filter or Update
`POST api/filters/save`
```javascript
const body = {
  label: String,
  language: Array,
  region: Array,
  subscriptionDate: Array,
  browser: Array,
  os: Array,
  isNew: true // false if update
}
```

###18. Get all Filters
`GET api/filters`

###19. Create automation
`POST api/automation`
```javascript
const body = {
  websiteId: String,
  label: String,
  notifications: [{
    delayedTime: {
      immediately: Boolean, // Only for first PushMsg. If true dismiss next field
      after: String // 'N days|hours|minutes'
    },
    title: String,
    body: String,
    url: String,
    icon: String
  }],
  browserLang: String,
  status: String // new | active. If active it will run automatically
}
```

###20. Stop Automation
`PATCH api/automation/stop-automation/:id`

###21. Get all Automations
`GET api/automation/all`

###22. Get Automation by ID
`GET api/automation/:id`

###23. Run Automation
`PATCH api/automation/run-automation/:id`

###24. Edit Automation
`PATCH api/automation/edit-automation/:id`
```javascript
const body = {
  label: String,
  notifications: [{
    delayedTime: {
      immediately: Boolean, // Only for first PushMsg. If true dismiss next field
      after: String // 'N days|hours|minutes'
    },
    title: String,
    body: String,
    url: String,
    icon: String
  }],
  browserLang: String,
  status: String // cancelled | active. If active it will run automatically
}
```

###25. Delete Automation
`DELETE api/automation/:id`

###26. Delete Filter
`DELETE api/filters/:id`
