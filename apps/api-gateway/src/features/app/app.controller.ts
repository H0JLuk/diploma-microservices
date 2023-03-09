import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  init(@Res() res: Response) {
    return res.send(
      '<style>body {background: #333}</style><div style="display: flex; align-items: center; justify-content: center;  color: #fff; font-family: Roboto, sans-serif; font-weight: 500; font-size: 18px">Api gateway started &#128122</div>',
    );
  }
}
