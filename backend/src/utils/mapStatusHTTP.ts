import { ServiceResponseErrorType, ServiceResponseSuccessType } from '../types/ServiceResponse';

export default function mapStatusHTTP(status: ServiceResponseErrorType |
ServiceResponseSuccessType): number {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'CREATED': return 201;
    case 'INVALID_DATA': return 400;
    case 'UNAUTHORIZED': return 401;
    case 'NOT_FOUND': return 404;
    case 'CONFLICT': return 409;
    default: return 500;
  }
}
