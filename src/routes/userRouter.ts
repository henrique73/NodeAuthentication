import userHandler from '../handler/userHandler';
import authenticationMiddlewares from '../middlewares/authenticationMiddlewares';
import passport from 'passport';
import uploadAzure from '../config/azureBlobs';

export = (app: any) => {
  app.route('/users').post(userHandler.create);
  app
    .route('/users/login')
    .post(authenticationMiddlewares.local, userHandler.login);
  app
    .route('/secure')
    .get(authenticationMiddlewares.bearer, userHandler.protected);

  //Routes for Facebook Authentication
  app
    .route('/users/facebook')
    .get(passport.authenticate('facebook', { scope: ['email'] }));
  app
    .route('/auth/facebook/callback')
    .get(authenticationMiddlewares.facebook, userHandler.facebookCallback);

  //Routes for Google Authentication
  app
    .route('/users/google')
    .get(passport.authenticate('google', { scope: ['email', 'profile'] }));
  app
    .route('/auth/google/callback')
    .get(authenticationMiddlewares.google, userHandler.googleCallback);

  //Route for verifing email
  app
    .route('/users/verifyEmail/:token')
    .get(authenticationMiddlewares.verifyEmail, userHandler.verifyEmail);

  app.route('/upload').post(uploadAzure.single('file'), userHandler.upload);
};
