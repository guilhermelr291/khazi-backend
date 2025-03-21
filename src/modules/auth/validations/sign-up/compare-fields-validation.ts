import {
  BadRequestError,
  HttpError,
} from '../../../../common/errors/http-errors';

export class CompareFieldsValidation {
  constructor(
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {
    this.field = field;
    this.fieldToCompare = fieldToCompare;
  }
  validate(data: any): HttpError | void {
    if (data[this.field] !== data[this.fieldToCompare])
      throw new BadRequestError(
        `Field ${this.fieldToCompare} does not match ${this.field}`
      );
  }
}
