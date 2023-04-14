import React from 'react';

import { Button, ControlGroup, Form, Input, Select } from '@dtdot/lego';

export interface DockerImageFormValue {
  dockerImage: string;
  startCommand: string;
  isLocalImage: 'yes' | 'no';
  concurrency: 'PARALLEL' | 'SINGULAR';
}

export interface DockerImageFormProps {
  value: DockerImageFormValue;
  onChange: (value: DockerImageFormValue) => void;
  onSubmit: () => void;
  isSaving: boolean;
}

const isLocalImageOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const concurrencyOptions = [
  { label: 'Parallel', value: 'PARALLEL' },
  { label: 'Singular', value: 'SINGULAR' },
];

const DockerImageForm = ({ value, onChange, onSubmit, isSaving }: DockerImageFormProps) => {
  return (
    <Form value={value} onChange={onChange} onSubmit={onSubmit}>
      <ControlGroup variation='comfortable'>
        <Input
          name='dockerImage'
          label='Docker Image'
          placeholder='sample'
          description='Name of the docker image that runs the tests.'
        />
        <Input
          name='startCommand'
          label='Start Command'
          placeholder='node build/start.js'
          description='Start command for the docker container.\nLeave blank to use the default start command for the image.'
        />
        <Select
          name='concurrency'
          label='Concurrency'
          options={concurrencyOptions}
          description='Select if the tests should be run in parallel or singular mode.\nParallel is used for integrating with services like cypress dashboard that distribute the test load across multiple executors.'
        />
        <Select
          name='isLocalImage'
          label='Local Image'
          options={isLocalImageOptions}
          description='Is the docker image one that was built locally or one that is pulled from a registry?'
        />
        <Button type='submit' loading={isSaving}>
          Save
        </Button>
      </ControlGroup>
    </Form>
  );
};

export default DockerImageForm;
