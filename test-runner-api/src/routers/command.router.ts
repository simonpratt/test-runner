import { RabbitMqTopic } from '@test-runner/rabbitmq';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';

import environment from '../core/environment';
import { Command } from '../generated/client';
import commandService from '../services/command.service';
import { RabbitMqWebsocketDefinition } from '../types/rabbit.types';

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

      const consumer = new RabbitMqTopic<RabbitMqWebsocketDefinition>(environment.RABBITMQ_WS_EXCHANGE, 'COMMAND.*');
      consumer.subscribe('COMMAND.CREATE', (command) => onWatch({ type: 'create', command }));
      consumer.subscribe('COMMAND.UPDATE', (command) => onWatch({ type: 'update', command }));
      consumer.subscribe('COMMAND.DELETE', (command) => onWatch({ type: 'delete', command }));

      return () => {
        consumer.disconnect();
      };
    });
  }),
});

export default commandRouter;
