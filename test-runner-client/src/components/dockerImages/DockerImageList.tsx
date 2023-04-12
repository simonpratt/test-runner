import React, { useState } from 'react';

import { Button, Loader, PaddedLayout, Spacer, Table } from '@dtdot/lego';
import TableAction from '@dtdot/lego/build/components/Table/_TableAction';

import { useDockerImages } from '../../hooks/useDockerImages';
import NewDockerImageModal from './NewDockerImageModal';

const DockerImageList = () => {
  const { dockerImages, dockerImagesLoading, dockerImagesError, refetchDockerImages } = useDockerImages();
  const [showNewDockerImageModal, setShowNewDockerImageModal] = useState(false);

  if (!dockerImages || dockerImagesLoading) {
    return <Loader />;
  }

  return (
    <>
      <PaddedLayout>
        <Button onClick={() => setShowNewDockerImageModal(true)}>New Docker Image</Button>
        <Spacer size='4x' />
        <Table>
          <Table.Row>
            <Table.Cell>Image</Table.Cell>
            <Table.Cell>Start Command</Table.Cell>
            <Table.Cell>Local Image</Table.Cell>
          </Table.Row>
          {dockerImages.map((dockerImage) => (
            <Table.Row key={dockerImage.id}>
              <Table.Cell>{dockerImage.dockerImage}</Table.Cell>
              <Table.Cell>{dockerImage.startCommand}</Table.Cell>
              <Table.Cell>{dockerImage.isLocalImage ? 'Yes' : 'No'}</Table.Cell>
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

      {showNewDockerImageModal && (
        <NewDockerImageModal
          onClose={() => {
            setShowNewDockerImageModal(false);
            refetchDockerImages();
          }}
        />
      )}
    </>
  );
};

export default DockerImageList;
