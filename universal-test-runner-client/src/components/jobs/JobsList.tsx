import React, { useState } from 'react';

import { Button, Loader, PaddedLayout, Spacer, Table } from '@dtdot/lego';

import { useCommands } from '../../hooks/useCommands';
import { useJobs } from '../../hooks/useJobs';
import NewJobModal from './NewJobModal';

const JobsList = () => {
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const { jobs, jobsLoading } = useJobs();
  const { commands, commandsLoading } = useCommands();

  if (!jobs || jobsLoading) {
    return <Loader />;
  }

  if (!commands || commandsLoading) {
    return <Loader />;
  }

  return (
    <>
      <PaddedLayout>
        <Button onClick={() => setShowNewJobModal(true)}>Queue</Button>
        <Spacer size='4x' />
        <Table>
          <Table.Row>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Docker Image</Table.Cell>
            <Table.Cell>Discover Command</Table.Cell>
            <Table.Cell>Start Command</Table.Cell>
          </Table.Row>
          {jobs.map((job) => (
            <>
              <Table.Row key={job.id}>
                <Table.Cell>{job.status}</Table.Cell>
                <Table.Cell>{job.dockerImage}</Table.Cell>
                <Table.Cell>{job.startCommand}</Table.Cell>
                <Table.Cell>{job.selector}</Table.Cell>
              </Table.Row>
              {commands
                .filter((command) => command.jobId === job.id)
                .filter((_, __, array) => array.some((command) => command.status !== 'FINISHED'))
                .map((command) => (
                  <Table.Row key={command.id}>
                    <Table.Cell> - </Table.Cell>
                    <Table.Cell>{command.status}</Table.Cell>
                    <Table.Cell>{command.spec}</Table.Cell>
                  </Table.Row>
                ))}
            </>
          ))}
        </Table>
      </PaddedLayout>

      {showNewJobModal && <NewJobModal onClose={() => setShowNewJobModal(false)} />}
    </>
  );
};

export default JobsList;
