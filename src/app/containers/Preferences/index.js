import React from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import { currentUserSelector } from 'app/store/user/selectors';
import type { CurrentUser } from 'common/types';

import CodeIcon from 'react-icons/lib/fa/code';
import CreditCardIcon from 'react-icons/lib/md/credit-card';
import BrowserIcon from 'react-icons/lib/go/browser';
import StarIcon from 'react-icons/lib/go/star';
import CodeFormatIcon from 'react-icons/lib/fa/dedent';
import IntegrationIcon from 'react-icons/lib/md/device-hub';

import SideNavigation from './SideNavigation';

import EditorSettings from './EditorPageSettings/EditorSettings';
import PreviewSettings from './EditorPageSettings/PreviewSettings';
import CodeFormatting from './CodeFormatting';
import PaymentInfo from './PaymentInfo';
import Integrations from './Integrations';
import Badges from './Badges';

const Container = withTheme(styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
`);

const ContentContainer = styled.div`
  flex: 2;
  padding: 2rem;
`;

type Props = {
  user: CurrentUser,
};

const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class Preferences extends React.PureComponent {
  props: Props;

  state = {
    itemIndex: 0,
  };

  setItem = (index: number) => {
    this.setState({ itemIndex: index });
  };

  getItems = () => {
    const hasSubscription = Boolean(this.props.user.subscription);
    const signedIn = Boolean(this.props.user.jwt);
    return [
      {
        title: 'Editor',
        icon: <CodeIcon />,
        content: <EditorSettings />,
      },
      {
        title: 'Prettier Settings',
        icon: <CodeFormatIcon />,
        content: <CodeFormatting />,
      },
      {
        title: 'Preview',
        icon: <BrowserIcon />,
        content: <PreviewSettings />,
      },
      signedIn && {
        title: 'Integrations',
        icon: <IntegrationIcon />,
        content: <Integrations />,
      },
      hasSubscription && {
        title: 'Payment Info',
        icon: <CreditCardIcon />,
        content: <PaymentInfo />,
      },
      hasSubscription && {
        title: 'Badges',
        icon: <StarIcon />,
        content: <Badges />,
      },
    ].filter(x => x);
  };

  render() {
    return (
      <Container>
        <SideNavigation
          itemIndex={this.state.itemIndex}
          menuItems={this.getItems()}
          setItem={this.setItem}
        />
        <ContentContainer>
          {this.getItems()[this.state.itemIndex].content}
        </ContentContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Preferences);
