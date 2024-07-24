import { Controller, Get, Options, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

import { ActionHeaderInterceptor } from './interceptors/action-header/action-header.interceptor';

@Controller()
@UseInterceptors(ActionHeaderInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('actions.json')
  getActions() {
    return this.appService.getRules();
  }

  @Options('*')
  fakeOptions(): string {
    return 'ok';
  }
}
