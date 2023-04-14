import React, { useEffect } from 'react';

import { Modal } from '@dtdot/lego';

import { load } from 'js-yaml';

import { apiConnector } from '../../core/api.connector';
import { useEnvironment } from '../../hooks/useEnvironment';
import EnvironmentForm, { EnvironmentFormValue } from './EnvironmentForm';

export interface EditEnvironmentModalProps {
  id: string;
  onClose: () => void;
}

const EditEnvironmentModal = ({ id, onClose }: EditEnvironmentModalProps) => {
  const [form, setForm] = React.useState<EnvironmentFormValue>();
  const { environment } = useEnvironment(id);
  const {
    mutate: updateEnvironment,
    isLoading: updateEnvironmentLoading,
    isSuccess: updateEnvironmentSuccess,
  } = apiConnector.environments.updateEnvironment.useMutation();

  useEffect(() => {
    if (environment && !form) {
      setForm({
        id: environment.id,
        name: environment.name,
        concurrencyLimit: environment.concurrencyLimit,
        variables: environment.EnvironmentVariable.map(({ name, value }) => `${name}: ${value}`).join('\n'),
      });
    }
  }, [environment, form, setForm]);

  useEffect(() => {
    if (updateEnvironmentSuccess) {
      onClose();
    }
  }, [updateEnvironmentSuccess, onClose]);

  const handleSubmit = async () => {
    if (form) {
      const { variables, ...otherFormVals } = form;
      const envVariables = load(variables) as Record<string, string>;
      const envVariablesArray = Object.entries(envVariables).map(([name, value]) => ({ name, value }));
      const postBody = { variables: envVariablesArray, ...otherFormVals };
      updateEnvironment(postBody);
    }
  };

  return (
    <Modal onClose={onClose} loading={!form}>
      <Modal.Header header='Edit Environment' />
      <Modal.Body>
        {form && (
          <EnvironmentForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isSaving={updateEnvironmentLoading}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditEnvironmentModal;
