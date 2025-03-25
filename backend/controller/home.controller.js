const {google} = require('googleapis')
require('dotenv').config()

exports.get_home = async (request, response) => {

  if (request.user.accessToken) {
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3000/log_in/success')
    oauth2Client.setCredentials({
      access_token: request.user.accessToken
    })
  
    const tokenInfo = await oauth2Client.getTokenInfo(request.user.accessToken);
    console.log("Token Scopes:", tokenInfo.scopes);

    const calendar = google.calendar({version: 'v3', auth: oauth2Client})
    calendar.calendarList.list({}, (err, res) => {
      if(err) {
        console.log('Error with calendar: ', err)
        response.end('Error')
        return
      }
      const calendars = res.data.items;
      console.log(calendars)
      // response.json(calendars)
    })
  }
  response.render("home_page"); 
  
};