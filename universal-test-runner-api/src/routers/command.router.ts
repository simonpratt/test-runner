import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';

import environment from '../core/environment';
import { RabbitInstance } from '../external/rabbit/rabbit.instance';
import { Command } from '../generated/client';
import commandService from '../services/command.service';

const t = initTRPC.create();

type CommandEvent =
  | { type: 'create'; command: Command }
  | { type: 'update'; command: Command }
  | { type: 'delete'; command: Command };

const publicProcedure = t.procedure;
const router = t.router;

const commandRouter = router({
  getCommands: publicProcedure.query(async () => {
    return commandService.getCommands();
  }),
  watchCommands: publicProcedure.subscription(() => {
    return observable<CommandEvent>((emit) => {
      const onWatch = (data: CommandEvent) => {
        emit.next(data);
      };

      console.log('Connecting to RabbitMQ...');

      const consumer = new RabbitInstance(environment.RABBITMQ_WS_EXCHANGE);
      consumer.subscribe('COMMAND.CREATE', (command: any) => onWatch({ type: 'create', command }));
      consumer.subscribe('COMMAND.UPDATE', (command: any) => onWatch({ type: 'update', command }));
      consumer.subscribe('COMMAND.DELETE', (command: any) => onWatch({ type: 'delete', command }));

      return () => {
        consumer.disconnect();
      };
    });
  }),
});

export default commandRouter;
