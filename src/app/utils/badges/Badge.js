import React from 'react';
import styled from 'react-emotion';
import Tooltip from 'app/components/Tooltip';

import getBadge from './';

const NameContainer = styled.div`
  display: inline-block;
  text-align: center;
`;

const Image = styled.img`
  transition: 0.3s ease all;
  margin-bottom: -0.4em;

  opacity: ${props => (props.visible ? 1 : 0.5)};
  cursor: pointer;

  &:hover {
    ${props => !props.visible && `opacity: .75;`};
  }
`;

type Props = {
  badge: {
    id: string,
    name: string,
    visible: boolean,
  },
  size: number,
  onClick: ?Function,
  tooltip: ?string,
};

export default class Badge extends React.PureComponent {
  props: Props;

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.badge);
    }
  };

  render() {
    const { badge, tooltip, size, onClick, ...props } = this.props;
    const innerContent = (
      <Image
        {...props}
        width={size}
        src={getBadge(badge.id)}
        alt={badge.name}
        visible={badge.visible}
        onClick={this.handleClick}
      />
    );
    if (tooltip !== false) {
      return (
        <Tooltip style={{ display: 'block' }} title={tooltip || badge.name}>
          {/* Margin Bottom to compensate for the tooltip */}
          {innerContent}
        </Tooltip>
      );
    }
    return (
      <NameContainer>
        {innerContent}
        <div style={{ marginTop: '0.5rem' }}>{badge.name}</div>
      </NameContainer>
    );
  }
}
