import { Router } from 'express';
import { makeShopeeController } from '../../../common/factories/shopee/shopee-controller-factory';

const shopeeController = makeShopeeController();

export default (router: Router): void => {
  router.post('/shopee/auth/url', (req, res, next) =>
    shopeeController.generateAuthLinkShopee(req, res, next)
  );

  router.get('/auth/callback', (req, res, next) => {
    shopeeController.getCodeAndShopeeId(req, res, next);
  });

  router.get('/auth/activate', (req, res, next) => {
    shopeeController.checkAccountIsConnected(req, res, next);
  });
};
