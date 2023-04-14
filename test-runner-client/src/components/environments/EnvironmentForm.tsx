import React from 'react';

import { Button, ControlGroup, Form, Input, TextArea } from '@dtdot/lego';

export interface EnvironmentFormValue {
  id: string;
  name: string;
  variables: string;
  concurrencyLimit: number;
}

export interface EnvironmentFormProps {
  value: EnvironmentFormValue;
  onChange: (value: EnvironmentFormValue) => void;
  onSubmit: () => void;
  isSaving: boolean;
}

const EnvironmentForm = ({ value, onChange, onSubmit, isSaving }: EnvironmentFormProps) => {
  return (
    <Form value={value} onChange={onChange} onSubmit={onSubmit}>
      <ControlGroup variation='comfortable'>
        <Input
          name='id'
          label='Id'
          placeholder='environment-01'
          description='A unique ID for the environment\nThis would be used by any external service that is requesting to start a test run'
        />
        <Input
          name='name'
          label='Name'
          placeholder='Environment 01'
          description='User facing name of the environment for when a test run is being started'
        />
        <Input
          name='concurrencyLimit'
          label='Concurrency Limit'
          placeholder='4'
          description='How many tests should be run in parallel against this environment?'
        />
        <TextArea name='variables' label='Variables' placeholder='API_URL: http://xyz.com' />
        <Button type='submit' loading={isSaving}>
          Save
        </Button>
      </ControlGroup>
    </Form>
  );
};

export default EnvironmentForm;
