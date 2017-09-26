// @flow
import * as React from 'react';
import styled from 'react-emotion';
import { sortBy } from 'lodash';

import type { Module, Directory } from 'common/types';
import { isMainModule } from 'app/store/entities/sandboxes/modules/selectors';

import File from './File';

const Container = styled.div`line-height: 1;`;

type Props = {
  modules: Array<Module>,
  directories: Array<Directory>,
  directoryId: string,
  depth: number,
  currentModule: string,
  setCurrentModule: (id: string, shortid: string) => any,
  template: string,
};

const Files = ({
  modules,
  directories,
  directoryId,
  depth = 0,
  currentModule,
  setCurrentModule,
  template,
}: Props) => {
  const childrenModules = modules.filter(
    m => m.directoryShortid === directoryId
  );

  const childrenDirectories = directories.filter(
    d => d.directoryShortid === directoryId
  );

  return (
    <Container>
      {sortBy(childrenDirectories, d => d.title).map(d => (
        <div key={d.shortid}>
          <File
            id={d.id}
            shortid={d.shortid}
            title={d.title}
            type="directory"
            depth={depth}
            setCurrentModule={setCurrentModule}
          />
          <Files
            modules={modules}
            directories={directories}
            directoryId={d.shortid}
            depth={depth + 1}
            setCurrentModule={setCurrentModule}
            currentModule={currentModule}
            template={template}
          />
        </div>
      ))}
      {sortBy(childrenModules, m => m.title).map(m => (
        <File
          id={m.id}
          shortid={m.shortid}
          title={m.title}
          key={m.shortid}
          type="module"
          depth={depth}
          setCurrentModule={setCurrentModule}
          active={m.id === currentModule}
          alternative={isMainModule(m, template)}
        />
      ))}
    </Container>
  );
};

export default Files;
