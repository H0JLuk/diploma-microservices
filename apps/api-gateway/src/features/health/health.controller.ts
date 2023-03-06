import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SwaggerResponse } from './swagger';

@Controller()
@ApiTags('health')
export class HealthController {
  @Get('/health')
  @ApiResponse(SwaggerResponse.getHealth[200])
  @ApiResponse(SwaggerResponse.getHealth[500])
  async getHealth(): Promise<string> {
    return 'hello!';
  }
}
