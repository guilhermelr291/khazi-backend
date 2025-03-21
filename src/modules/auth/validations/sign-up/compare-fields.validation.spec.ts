import { describe, expect, test } from 'vitest';
import { CompareFieldsValidation } from './compare-fields-validation';

describe('CompareFieldsValidation', () => {
  test('ensure CompareFieldsValidation throws if field does not match fieldToCompare', () => {
    const field = 'any_field';
    const fieldToCompare = 'other_field';
    const sut = new CompareFieldsValidation(field, fieldToCompare);

    expect(() =>
      sut.validate({ any_field: 'value', other_field: 'different_value' })
    ).toThrow();
  });
});
