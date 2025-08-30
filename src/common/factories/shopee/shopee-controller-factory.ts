import { ShopeeController } from '../../../modules/shopee/controller/shopee-controller';
import { ShopeeService } from '../../../modules/shopee/service/shopee-service';

export const makeShopeeController = () => {
  const shopeeService = new ShopeeService();
  return new ShopeeController(shopeeService);
};
