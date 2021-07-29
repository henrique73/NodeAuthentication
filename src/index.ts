import express from 'express';
import router from './routes/userRouter';
import { connect } from './repository/database';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

connect();

const authenticationStrategies = require('./config/passport');

app.use(passport.initialize());
app.use(express.json());

router(app);

module.exports = app.listen(3000, () => {
  console.log("Server's running on Port 3000");
});
