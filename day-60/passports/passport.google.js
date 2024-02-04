const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User, Provider } = require("../models/index");
const bcrypt = require("bcrypt");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      "https://google-login-day60-hw.vercel.app/auth/google/callback",
    scope: ["email", "profile"],
  },
  async function (accessToken, refreshToken, profile, done) {
    const { displayName: name, emails } = profile;

    const [provider] = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: { name: "google" },
    });

    const [user] = await User.findOrCreate({
      where: { email: emails[0].value },
      defaults: {
        name,
        email: emails[0].value,
        // password: bcrypt.hashSync("123123", 10),
        provider_id: provider.id,
      },
    });
    done(null, user);
  }
);
