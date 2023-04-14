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
        <Input name='id' label='Id' placeholder='environment-01' />
        <Input name='name' label='Name' placeholder='Environment 01' />
        <Input name='concurrencyLimit' label='Concurrency Limit' placeholder='4' />
        <TextArea name='variables' label='Variables' placeholder='API_URL: http://xyz.com' />
        <Button type='submit' loading={isSaving}>
          Save
        </Button>
      </ControlGroup>
    </Form>
  );
};

export default EnvironmentForm;
