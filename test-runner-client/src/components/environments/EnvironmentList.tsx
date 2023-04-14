import React, { useState } from 'react';

import { Alert, Button, Loader, PaddedLayout, Spacer, Table } from '@dtdot/lego';
import TableAction from '@dtdot/lego/build/components/Table/_TableAction';

import { useEnvironments } from '../../hooks/useEnvironments';
import EditEnvironmentModal from './EditEnvironmentModal';
import NewEnvironmentModal from './NewEnvironmentModal';

const EnvironmentList = () => {
  const { environments, environmentsLoading, environmentsError, refetchEnvironments } = useEnvironments();
  const [showNewEnvironmentModal, setShowNewEnvironmentModal] = useState(false);
  const [editEnvironmentId, setEditEnvironmentId] = useState<string>();

  if (!environments || environmentsLoading) {
    return <Loader />;
  }

  if (environmentsError) {
    return <Alert variant='danger' message='Error loading environments' />;
  }

  return (
    <>
      <PaddedLayout>
        <Button onClick={() => setShowNewEnvironmentModal(true)}>New Environment</Button>
        <Spacer size='4x' />
        <Table>
          <Table.Row>
            <Table.Cell>ID</Table.Cell>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Variable Count</Table.Cell>
          </Table.Row>
          {environments.map((environment) => (
            <Table.Row key={environment.id}>
              <Table.Cell>{environment.id}</Table.Cell>
              <Table.Cell>{environment.name}</Table.Cell>
              <Table.Cell>{environment.EnvironmentVariable.length}</Table.Cell>
              <Table.Cell>
                <TableAction
                  text='Edit'
                  onClick={() => {
                    setEditEnvironmentId(environment.id);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </PaddedLayout>

      {showNewEnvironmentModal && (
        <NewEnvironmentModal
          onClose={() => {
            setShowNewEnvironmentModal(false);
            refetchEnvironments();
          }}
        />
      )}

      {editEnvironmentId && (
        <EditEnvironmentModal
          id={editEnvironmentId}
          onClose={() => {
            setEditEnvironmentId(undefined);
            refetchEnvironments();
          }}
        />
      )}
    </>
  );
};

export default EnvironmentList;
