import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Options,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionHeaderInterceptor } from 'src/interceptors/action-header/action-header.interceptor';

@Controller('actions')
@UseInterceptors(ActionHeaderInterceptor)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('transfer-sol/:destination')
  getTransferSol(@Param('destination') destination: string) {
    try {
      return this.actionsService.getTransferSol(destination);
    } catch (error) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('transfer-sol/:destination')
  postTransferSol(
    @Param('destination') destination: string,
    @Query('amount') amount: number,
    @Body('account') account: string,
  ) {
    try {
      return this.actionsService.postTransferSol(account, destination, amount);
    } catch (error) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  @Options('*')
  optionsTransferSol(): string {
    return 'ok';
  }
}
