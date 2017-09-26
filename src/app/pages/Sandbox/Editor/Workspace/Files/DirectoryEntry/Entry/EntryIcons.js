import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'theming';

import ProjectIcon from 'react-icons/lib/go/file-code';
import FunctionIcon from 'react-icons/lib/fa/code';
import FolderIcon from 'react-icons/lib/md/keyboard-arrow-down';
import DirectoryIcon from 'react-icons/lib/go/file-directory';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';
import CSSIcon from 'react-icons/lib/fa/css3';
import HTMLIcon from 'react-icons/lib/fa/html5';
import ErrorIcon from 'react-icons/lib/md/error';
import RawIcon from 'react-icons/lib/go/file-text';
import ReactIcon from 'app/components/ReactIcon';
import TypeScriptIcon from 'app/components/TypeScriptIcon';

const NotSyncedIconWithMargin = withTheme(styled(NotSyncedIcon)`
  margin-left: -20px;
  margin-right: 6px;
  color: ${props => props.theme.templateColor || props.theme.secondary};
`);

const RedIcon = withTheme(styled.span`color: ${props => props.theme.red};`);

const StyledFolderIcon = styled.span`
  svg {
    transition: 0.3s ease transform;
    margin-left: -20px;
    margin-right: 6px;

    transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
  }
`;

const getIcon = (type, error, root) => {
  if (root) {
    return <ProjectIcon />;
  }
  if (error) {
    return (
      <RedIcon>
        <ErrorIcon />
      </RedIcon>
    );
  }

  switch (type) {
    case 'react':
      return <ReactIcon />;
    case 'js':
    case 'json':
    case 'function':
      return <FunctionIcon />;
    case 'directory':
      return <DirectoryIcon />;
    case 'css':
      return <CSSIcon />;
    case 'ts':
      return <TypeScriptIcon />;
    case 'html':
      return <HTMLIcon />;
    default:
      return <RawIcon />;
  }
};

type Props = {
  type: string,
  hasChildren: boolean,
  isNotSynced: ?boolean,
  isOpen?: boolean,
  onOpen: () => void,
  root: ?boolean,
  error: boolean,
};
export default function EntryIcon({
  type,
  root,
  error,
  hasChildren,
  isNotSynced,
  isOpen,
  onOpen,
}: Props) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {isNotSynced && <NotSyncedIconWithMargin />}
      {type === 'directory' &&
      hasChildren && (
        <StyledFolderIcon isOpen={isOpen} onClick={onOpen}>
          <FolderIcon />
        </StyledFolderIcon>
      )}
      {getIcon(type, error, root)}
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};
