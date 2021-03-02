//Newsletter signup using node js and Mailchimp's api
//require all modeules required
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

//authentication for mailchimp server access
client.setConfig({
  apiKey: "YOUR_API_KEY",
  server: "YOUR_SERVER"//The server initials are at the end of your key, e.g. us1, us7
});

//using local static files for our homepage
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//fetching app's homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//getting required inputs from the html form
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.inputEmail;

  console.log(email)
//attributes for subscribing user
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      const response = await client.lists.addListMember("YOUR_LIST_ID", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

//in case of already existing user
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//listen to heroku's port or our local server
app.listen(process.env.PORT || 3000, function() {
  console.log("server is up and running");
})
