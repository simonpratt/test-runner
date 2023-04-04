import React, { useState } from 'react';

import { Button, Loader, PaddedLayout, Spacer, Table } from '@dtdot/lego';
import TableAction from '@dtdot/lego/build/components/Table/_TableAction';

import { useEnvironments } from '../../hooks/useEnvironments';
import NewEnvironmentModal from './NewEnvironmentModal';

const EnvironmentList = () => {
  const { environments, environmentsLoading, environmentsError, refetchEnvironments } = useEnvironments();
  const [showNewEnvironmentModal, setShowNewEnvironmentModal] = useState(false);

  if (!environments || environmentsLoading) {
    return <Loader />;
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
                    console.log('Edit...');
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
    </>
  );
};

export default EnvironmentList;
