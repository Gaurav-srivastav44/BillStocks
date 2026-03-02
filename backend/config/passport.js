import dotenv from "dotenv";
dotenv.config();   // 🔥 ADD THIS AT TOP

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID); // optional debug

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }

        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;