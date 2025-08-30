import { NextFunction, Request, Response } from 'express';
import { ShopeeService } from '../service/shopee-service';

export class ShopeeController {
  constructor(private readonly shopeeService: ShopeeService) {}

  async generateAuthLinkShopee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { redirectUrl } = req.body;

      console.log('cheguei aqui');

      if (!redirectUrl) {
        res.status(400).json({ error: 'Dados incompletos.' });
        return;
      }

      const result = await this.shopeeService.generateAuthLinkShopee(
        redirectUrl
      );
      res.status(201).json(result);
    } catch (error) {
      console.error('Error generating Shopee auth link:', error);
      next(error);
    }
  }

  async getCodeAndShopeeId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code, shop_id, userId } = req.query;
      if (!code || !shop_id) {
        res.status(400).json({ error: 'Dados incompletos.' });
        return;
      }

      await this.shopeeService.getCodeAndShopId(code, shop_id, userId);

      res.status(200).json({ message: 'Shopee conectada com sucesso.' });
    } catch (error) {
      console.error('Error connecting Shopee:', error);
      next(error);
    }
  }

  async checkAccountIsConnected(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.query.userId);

      const isAuthorized = await this.shopeeService.checkAccountIsConnected(
        userId
      );

      res.status(200).json({ isAuthorized });
    } catch (error) {
      console.error('Error checking Shopee account connection:', error);
      next(error);
    }
  }
}
