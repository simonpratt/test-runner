import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { menuHelpers, MinimalMenu } from '@dtdot/lego';

import { faDocker } from '@fortawesome/free-brands-svg-icons';
import { faList, faTerminal } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MinimalMenu>
      <MinimalMenu.Item
        icon={faList}
        active={menuHelpers.isActiveItem([/\/queue/g], location.pathname)}
        onClick={() => navigate('/queue')}
      />
      <MinimalMenu.Item
        icon={faTerminal}
        active={menuHelpers.isActiveItem([/\/environments/g], location.pathname)}
        onClick={() => navigate('/environments')}
      />
      <MinimalMenu.Item
        icon={faDocker as any}
        active={menuHelpers.isActiveItem([/\/docker-images/g], location.pathname)}
        onClick={() => navigate('/docker-images')}
      />
    </MinimalMenu>
  );
};

export default Menu;
