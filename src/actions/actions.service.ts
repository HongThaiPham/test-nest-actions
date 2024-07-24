import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActionGetResponse,
  ActionPostResponse,
  createPostResponse,
  ActionError,
} from '@solana/actions';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

@Injectable()
export class ActionsService {
  private _connection = new Connection(clusterApiUrl('devnet'));
  constructor(private configService: ConfigService) {}
  getTransferSol(destination: string): ActionGetResponse {
    const toPubkey = new PublicKey(destination);
    const baseHref = `${this.configService.get<string>('BASE_URL')}/actions/transfer-sol/${toPubkey.toBase58()}`;
    const payload: ActionGetResponse = {
      title: 'Actions Example - Transfer Native SOL',
      label: '',
      icon: 'https://solana-actions.vercel.app/solana_devs.jpg',
      description: 'Transfer SOL to another Solana wallet',
      links: {
        actions: [
          { label: 'Send 0.1 SOL', href: `${baseHref}?amount=0.1` },
          { label: 'Send 0.5 SOL', href: `${baseHref}?amount=0.5` },
          { label: 'Send 1 SOL', href: `${baseHref}?amount=1` },
          {
            label: 'Send SOL',
            href: `${baseHref}?amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter the amount of SOL to send',
                required: true,
              },
            ],
          },
        ],
      },
    };
    return payload;
  }

  async postTransferSol(
    account: string,
    destination: string,
    amount: number,
  ): Promise<ActionPostResponse> {
    if (!account) {
      throw new Error('Account is required');
    }
    const toPubkey = new PublicKey(destination);
    const fromPubkey = new PublicKey(account);

    let normalizedAmount: number;
    try {
      normalizedAmount = parseFloat(amount.toString());
      if (normalizedAmount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
    } catch (error) {
      throw new Error('Invalid amount');
    }

    const minimumBalance =
      await this._connection.getMinimumBalanceForRentExemption(0);

    if (normalizedAmount * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const { blockhash, lastValidBlockHeight } =
      await this._connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: normalizedAmount * LAMPORTS_PER_SOL,
      }),
    );

    let payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Sending ${normalizedAmount} SOL to ${toPubkey.toBase58()}`,
      },
    });
    return payload;
  }
}
