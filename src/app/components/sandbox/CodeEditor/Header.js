import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import Button from 'app/components/buttons/Button';
import { Tooltip } from 'react-tippy';

const Container = withTheme(styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  box-shadow: 0 3px 3px ${props => props.theme.background2};
  color: ${props => props.theme.white};
  padding: 0.5rem 1rem;
  height: 3rem;
  flex: 0 0 3rem;
  box-sizing: border-box;
  justify-content: space-between;
  vertical-align: middle;
  align-items: center;
`);

const Path = withTheme(styled.span`
  color: ${props => props.theme.background.lighten(1.25)};
  padding-right: 0.1rem;
`);

const Buttons = styled.div`
  display: flex;
  button {
    width: 6rem;
    margin: 0.5rem;
  }
`;

type Props = {
  path: string,
  saveComponent: ?() => void,
  prettify: ?Function,
};

export default ({ path, saveComponent, prettify }: Props) => {
  const pathParts = path.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const pathName = pathParts.slice(0, pathParts.length - 1).join('/');
  return (
    <Container>
      <div>
        <Path>{pathName}/</Path>
        {fileName}
      </div>

      <Buttons>
        <Tooltip position="bottom" title="Made possible by Prettier">
          <Button disabled={!prettify} onClick={prettify} small>
            Prettify
          </Button>
        </Tooltip>
        <Button disabled={!saveComponent} onClick={saveComponent} small>
          Save
        </Button>
      </Buttons>
    </Container>
  );
};
