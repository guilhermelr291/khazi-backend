import { describe, expect, test } from 'vitest';
import { FieldComparerValidation } from './field-comparer';

describe('CompareFieldsValidation', () => {
  test('Should throw if field does not match fieldToCompare', () => {
    const field = 'any_field';
    const fieldToCompare = 'other_field';
    const sut = new FieldComparerValidation(field, fieldToCompare);

    expect(() =>
      sut.compare({ any_field: 'value', other_field: 'different_value' })
    ).toThrow();
  });
  test('Should return void if field matches fieldToCompare', () => {
    const field = 'any_field';
    const fieldToCompare = 'other_field';
    const sut = new FieldComparerValidation(field, fieldToCompare);

    const result = sut.compare({ any_field: 'value', other_field: 'value' });

    expect(result).toBeFalsy();
  });
});
