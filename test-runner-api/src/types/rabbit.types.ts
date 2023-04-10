import { Command, Job } from '../generated/client';

export type RabbitMqWebsocketDefinition = {
  'COMMAND.CREATE': Command;
  'COMMAND.UPDATE': Command;
  'COMMAND.DELETE': Command;
  'JOB.CREATE': Job;
  'JOB.UPDATE': Job;
  'JOB.DELETE': Job;
  'HEALTH_CHECK.TEST_MESSAGE': { data: string };
};

export type RabbitMqCommandRunDefinition = {
  'COMMAND.RUN': {
    commandId: string;
    dockerImage: string;
    startCommand: string;
    variables: { name: string; value: string }[];
  };
};
