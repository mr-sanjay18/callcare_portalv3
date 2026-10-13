require("dotenv").config();

const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const destination = process.argv[2];

if (!destination) {
  console.error("Usage: node test-call.cjs +91XXXXXXXXXX");
  process.exit(1);
}

client.calls.create({
  to: destination,
  from: process.env.TWILIO_NUMBER,
  twiml: `
    <Response>
      <Say>
        Hello! This is a real phone call from
        CallCare Portal version three.
        Thank you for testing our application.
      </Say>
    </Response>
  `
})
.then(call => console.log("Call created:", call.sid))
.catch(error => {
  console.error("Twilio error code:", error.code);
  console.error("Message:", error.message);
});