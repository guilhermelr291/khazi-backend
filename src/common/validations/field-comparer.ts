import { BadRequestError, HttpError } from '../errors/http-errors';
import { FieldComparer } from '../../modules/auth/protocols/fields-comparer';

export class FieldComparerValidation implements FieldComparer {
  constructor(
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {
    this.field = field;
    this.fieldToCompare = fieldToCompare;
  }
  compare(data: any): HttpError | void {
    if (data[this.field] !== data[this.fieldToCompare])
      throw new BadRequestError(
        `Field ${this.fieldToCompare} does not match ${this.field}`
      );
  }
}
