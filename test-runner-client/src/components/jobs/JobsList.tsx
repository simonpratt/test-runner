import React, { useState } from 'react';

import { Button, ButtonGroup, Loader, PaddedLayout, Spacer, Table } from '@dtdot/lego';

import { apiConnector } from '../../core/api.connector';
import { useCommands } from '../../hooks/useCommands';
import { useDockerImages } from '../../hooks/useDockerImages';
import { useEnvironments } from '../../hooks/useEnvironments';
import { useJobs } from '../../hooks/useJobs';
import NewJobModal from './NewJobModal';

const JobsList = () => {
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const { jobs, jobsLoading } = useJobs();
  const { commands, commandsLoading } = useCommands();
  const { environments, environmentsLoading } = useEnvironments();
  const { dockerImages, dockerImagesLoading } = useDockerImages();
  const { mutate: clearJobs } = apiConnector.job.clearJobs.useMutation();

  if (!jobs || jobsLoading) {
    return <Loader />;
  }

  if (!commands || commandsLoading) {
    return <Loader />;
  }

  return (
    <>
      <PaddedLayout>
        <ButtonGroup>
          <Button onClick={() => setShowNewJobModal(true)}>Queue</Button>
          <Button variant='tertiary' onClick={() => clearJobs()}>
            Clear
          </Button>
        </ButtonGroup>
        <Spacer size='4x' />
        <Table>
          <Table.Row>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Docker Image</Table.Cell>
            <Table.Cell>Environment</Table.Cell>
            <Table.Cell>Selector</Table.Cell>
          </Table.Row>
          {jobs.map((job) => (
            <>
              <Table.Row key={job.id}>
                <Table.Cell>{job.status}</Table.Cell>
                <Table.Cell>{dockerImages?.find((img) => img.id === job.dockerImageConfigId)?.name}</Table.Cell>
                <Table.Cell>{environments?.find((env) => env.id === job.environmentId)?.name}</Table.Cell>
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
