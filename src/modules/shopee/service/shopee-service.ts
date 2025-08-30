import crypto from 'crypto';
import prisma from '../../../../prisma/db';
import axios from 'axios';
import db from '../../../../prisma/db';

export class ShopeeService {
  private readonly partnerId: string;
  private readonly partnerKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.partnerId = process.env.PARTNER_ID!;
    this.partnerKey = process.env.PARTNER_KEY!;
    this.baseUrl = process.env.SHOPEE_URL!;
  }

  getTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  generateSign(baseString: string) {
    return crypto
      .createHmac('sha256', this.partnerKey)
      .update(baseString)
      .digest('hex');
  }

  generateUrl({ path, query }: { path: string; query: Record<string, any> }) {
    const url = new URL(`${this.baseUrl}${path}`);

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, value);
      }
    }

    return url.toString();
  }

  async generateAuthLinkShopee(redirectUrl: string) {
    const path = '/api/v2/shop/auth_partner';
    const timestamp = this.getTimestamp();
    const baseString = `${this.partnerId}${path}${timestamp}`;
    const sign = this.generateSign(baseString);

    return this.generateUrl({
      path,
      query: {
        partner_id: this.partnerId,
        redirect: redirectUrl,
        timestamp,
        sign,
      },
    });
  }

  async createAccessToken({
    shop_id,
    code,
  }: {
    shop_id: number;
    code: string;
  }) {
    const path = '/api/v2/auth/token/get';
    const timestamp = this.getTimestamp();
    const sign = this.generateSign(`${this.partnerId}${path}${timestamp}`);

    const url = this.generateUrl({
      path,
      query: {
        partner_id: this.partnerId,
        timestamp,
        sign,
      },
    });

    const body = {
      shop_id,
      code,
      partner_id: Number(this.partnerId),
    };

    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  }

  async getCodeAndShopId(code: string, shop_id: string, userId: string) {
    const token = await this.createAccessToken({
      shop_id: Number(shop_id),
      code,
    });

    const id = Number(userId);

    await prisma.$transaction(
      async tx => {
        await prisma.user.update({
          where: { id },
          data: { shopId: Number(shop_id) },
        });

        const existingToken = await tx.userToken.findFirst({
          where: { userId: id },
        });

        if (existingToken) {
          await prisma.userToken.update({
            where: { id: existingToken.id },
            data: {
              accessToken: token.access_token,
              refreshToken: token.refresh_token,
            },
          });
        } else {
          await prisma.userToken.create({
            data: {
              userId: id,
              accessToken: token.access_token,
              refreshToken: token.refresh_token,
            },
          });
        }
      },
      {
        timeout: 300000,
      }
    );

    return { success: true };
  }

  async checkAccountIsConnected(userId: number) {
    const isExists = await db.userToken.findFirst({
      where: { userId },
    });

    return !!isExists?.refreshToken;
  }
}
