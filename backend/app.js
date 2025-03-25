// Requirements
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");

const {google} = require('googleapis')

require("dotenv").config();
require("./util/google_auth");

// Server set-up
const app = express(); 

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT)


app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
  });
  res.redirect(url)
})

app.get('/redirect', (req, res) => {
  const code = req.query.code;
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.log(err)
      res.send('Error')
      return 
    }

    oauth2Client.setCredentials(token)
    res.send('successfully logged in');
  })
})

app.get('/calendar', (req, res) => {
  const calendar = google.calendar({version: 'v3', auth: oauth2Client})
  calendar.calendarList.list({}, (err, response) => {
    if (err) {
      console.log(err)
      res.send('Error')
      return 
    }
    const calendars = response.data.items;
    console.log(calendars)
    res.json(calendars)
  })
})

app.get('/events', (req, res) => {
  const calendarId = req.query.calendar ?? 'primary'
  
  const calendar = google.calendar({version: 'v3', auth: oauth2Client})
  calendar.calendarList.list({
    calendarId,
    timeMin: (new Date().toISOString()),
    maxResults: 15,
    singleEvents: true,
    orderBy: 'startTime'
  }, (err, response) => {
    if (err) {
      console.log(err)
      res.send('Error')
      return 
    }
    const events = response.data.items;
    console.log(events)
    res.json(events)
  })
})

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "../frontend/views"),
  path.join(__dirname, "../frontend/views/error"),
]);
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.use(
  session({
    secret:
    "mi string secreto que debe ser un string aleatorio muy largo, no como este lolxd",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection); 

app.use(passport.authenticate("session"));

//  Routes and middlewares
const auth_middleware = require("./util/auth_middleware");

const login_routes = require("./routes/login.routes");
const general_routes = require("./routes/general.routes");

const other_controllers = require("./controller/other.controller");

app.use("/log_in", login_routes);
app.use("/", auth_middleware, general_routes);

app.use(other_controllers.get_404);

// Start server
app.listen(3000, () => {
  console.log("App started in: http://localhost:3000");
});
