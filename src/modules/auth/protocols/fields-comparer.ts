import { HttpError } from '../../../common/errors/http-errors';

export interface FieldComparer {
  compare(data: any): HttpError | void;
}
