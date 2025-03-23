import { describe, vi, test, beforeEach, expect } from 'vitest';

import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockResolvedValue('encoded_value'),
  },
}));

describe('JwtAdapter', () => {
  let sut: JwtAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new JwtAdapter();
  });

  describe('encode', async () => {
    test('Should call jwt.sign with correct values', () => {
      sut.encode({ field: 'any_value' });

      expect(jwt.sign).toHaveBeenCalledWith(
        { field: 'any_value' },
        process.env.JWT_SECRET
      );
    });
  });
});
