import { Router } from 'express';
import { SignUpSchema } from '../validations/sign-up/schemas';
import { validate } from '../../../common/middlewares/validation-middleware';
import { makeAuthController } from '../../../common/factories/auth/auth-controller-factory';

const authController = makeAuthController();

export default (router: Router): void => {
  router.post('/signup', validate(SignUpSchema), (req, res, next) =>
    authController.signUp(req, res, next)
  );
};
