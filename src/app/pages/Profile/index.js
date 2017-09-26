/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import MaxWidth from 'app/components/flex/MaxWidth';
import Fullscreen from 'app/components/flex/Fullscreen';
import userActionCreators from 'app/store/entities/users/actions';
import { currentUserSelector } from 'app/store/user/selectors';
import type { User } from 'common/types';
import Margin from 'app/components/spacing/Margin';
import { usersSelector } from 'app/store/entities/users/selectors';
import { profileSandboxesUrl, profileLikesUrl } from 'app/utils/url-generator';

import NotFound from 'app/pages/NotFound';

import Header from './Header';
import Navigation from './Navigation';
import Showcase from './Showcase';
import Sandboxes from './Sandboxes';

type Props = {
  userActions: typeof userActionCreators,
  // eslint-disable-next-line
  match: { params: { username: string }, url: string },
  user: User,
  isCurrentUser: boolean,
};

const Container = styled(Fullscreen)`
  color: white;

  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(-180deg, #282d2f 0%, #1d1f20 100%);
`;

const Content = withTheme(styled(Fullscreen)`
  border-top: 1px solid ${props => props.theme.background3};
  flex: 0 0 70px;
`);

const mapStateToProps = createSelector(
  usersSelector,
  (_, props) => props.match.params.username,
  currentUserSelector,
  (users, username, currentUser) => {
    const userId = Object.keys(users).find(
      id => users[id].username === username
    );
    const user = users[userId];

    const isCurrentUser =
      currentUser && user && currentUser.username === user.username;

    return { user, isCurrentUser };
  }
);
const mapDispatchToProps = (dispatch: Function) => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class Profile extends React.PureComponent<
  Props,
  {
    notFound: boolean,
  }
> {
  state: {
    notFound: boolean,
  } = {
    notFound: false,
  };

  fetchUser = async (username: string) => {
    try {
      this.setState({ notFound: false });
      await this.props.userActions.fetchUser(username);
    } catch (e) {
      this.setState({ notFound: true });
    }
  };

  componentDidMount() {
    const { username } = this.props.match.params;

    this.fetchUser(username);
  }

  componentDidUpdate(prevProps: Props) {
    const username = prevProps.match.params.username;

    if (username !== this.props.match.params.username && !this.props.user) {
      this.fetchUser(this.props.match.params.username);
    }
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />;
    }

    const { user, match, userActions, isCurrentUser } = this.props;
    if (!user) return <div />;

    document.title = `${user.name || user.username} - CodeSandbox`;
    return (
      <Container>
        <Header user={user} />
        <Content>
          <MaxWidth>
            <Navigation
              username={user.username}
              sandboxCount={user.sandboxCount}
              likeCount={user.givenLikeCount}
            />
          </MaxWidth>
        </Content>
        <MaxWidth width={1024}>
          <Margin horizontal={2} style={{ minHeight: '60vh' }}>
            <Switch>
              <Route
                path={match.url}
                exact
                render={() => (
                  <Showcase
                    isCurrentUser={isCurrentUser}
                    id={user.showcasedSandboxShortid}
                  />
                )}
              />
              <Route
                path={`${profileSandboxesUrl(user.username)}/:page?`}
                // eslint-disable-next-line
                children={({ match }) => (
                  <Sandboxes
                    username={user.username}
                    fetchSandboxes={userActions.fetchAllSandboxes}
                    sandboxes={user.sandboxes}
                    isCurrentUser={isCurrentUser}
                    sandboxCount={user.sandboxCount}
                    baseUrl={profileSandboxesUrl(user.username)}
                    page={match.params.page && +match.params.page}
                  />
                )}
              />
              <Route
                path={`${profileLikesUrl(user.username)}/:page?`}
                // eslint-disable-next-line
                children={({ match }) => (
                  <Sandboxes
                    username={user.username}
                    fetchSandboxes={userActions.fetchLikedSandboxes}
                    sandboxes={user.likedSandboxes}
                    sandboxCount={user.givenLikeCount}
                    baseUrl={profileLikesUrl(user.username)}
                    page={match.params.page && +match.params.page}
                  />
                )}
              />
            </Switch>
          </Margin>
        </MaxWidth>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
