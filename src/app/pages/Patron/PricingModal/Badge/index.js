import React from 'react';
import styled from 'react-emotion';

import Relative from 'app/components/Relative';
import badges from 'app/utils/badges/patron-info';

import './animations.css';
import Particles from './Particles';

const BadgeContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 162px;
  height: 178px;
  top: -110px;
`;

type BadgeProp = 'patron-1' | 'patron-2' | 'patron-3' | 'patron-4';

type Props = {
  subscribed: boolean,
  badge: BadgeProp,
};

type BadgeProps = {
  badge: BadgeProp,
};

const Badge = ({ badge }: BadgeProps) => {
  const BadgeComponent = badges[badge].Badge;
  return (
    <BadgeContainer>
      <img src={BadgeComponent} className={`badge ${badge}`} alt={badge} />
    </BadgeContainer>
  );
};

export default ({ badge, subscribed }: Props) => (
  <Relative>
    {/* We prerender all particles, performance reasons */}
    <Particles makeItRain={subscribed} badge={badge} />
    <Badge key={badge} id="badge" badge={badge} />
  </Relative>
);
