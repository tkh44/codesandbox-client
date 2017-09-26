import React from 'react';
import styled from 'react-emotion';
import moment from 'moment';
import Tooltip from 'app/components/Tooltip';
import StarIcon from 'react-icons/lib/go/star';
import { withTheme } from 'theming';

const Container = withTheme(styled(Tooltip)`
  margin-left: 0.25rem;
  color: ${props => props.theme.primary()};
`);

export default ({
  subscriptionSince,
  ...props
}: {
  subscriptionSince: string,
}) => (
  <Container
    title={`Patron since ${moment(subscriptionSince).format('MMM Y')}`}
  >
    <StarIcon {...props} />
  </Container>
);
