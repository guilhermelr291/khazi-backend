import { HttpError } from '../../../common/factories/errors/http-errors';

export interface FieldComparer {
  compare(data: any): HttpError | void;
}
