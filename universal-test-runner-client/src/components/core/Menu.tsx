import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { menuHelpers, MinimalMenu } from '@dtdot/lego';

import { faCog } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MinimalMenu>
      <MinimalMenu.Item
        icon={faCog}
        active={menuHelpers.isActiveItem([/\/queue/g], location.pathname)}
        onClick={() => navigate('/queue')}
      />
    </MinimalMenu>
  );
};

export default Menu;
