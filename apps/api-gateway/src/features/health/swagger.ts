import { name } from 'apps/api-gateway/package.json';
import { Swagger } from 'libs/utils/documentation/swagger';

export const SwaggerResponse = {
  getHealth: {
    200: Swagger.defaultResponseText({ status: 200, text: `${name} UP!!` }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: '/health',
    }),
  },
};

export class SwaggerRequest {
  /** If requesters has a body.  */
}
