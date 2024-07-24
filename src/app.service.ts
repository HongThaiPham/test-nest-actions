import { Injectable } from '@nestjs/common';
import { ActionRuleObject, ActionsJson } from '@solana/actions';

@Injectable()
export class AppService {
  getRules(): ActionsJson {
    const rules: ActionRuleObject[] = [
      { pathPattern: '/*', apiPath: '/actions/*' },
      { pathPattern: '/actions/**', apiPath: '/actions/**' },
    ];
    return { rules };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
