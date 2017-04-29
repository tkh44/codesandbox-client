import _debug from 'app/utils/debug';

import callApi from '../../../services/api';

import dependenciesToQuery from './dependencies-to-query';
import logError from '../../../../utils/error';

const debug = _debug('cs:app:packager');

export const PACKAGER_URL = 'https://cdn.jsdelivr.net/webpack/v1';
export const PACKAGER_V2_URL = 'https://cdn.jsdelivr.net/webpack/v2';

/**
 * Request the packager, if retries > 4 it will throw if something goes wrong
 * otherwise it will retry again with an incremented retry
 *
 * @param {string} query The dependencies to call
 */
async function requestPackager(query: string) {
  let retries = 0;

  // Request packager v2 for cache warmup
  callApi(`${PACKAGER_V2_URL}/${query}/manifest.json`);

  while (true) {
    debug(`Trying to call packager for ${retries} time`);
    try {
      const url = `${PACKAGER_URL}/${query}`;
      const result = await callApi(`${url}/manifest.json`); // eslint-disable-line

      return { ...result, url };
    } catch (e) {
      if (retries < 5) {
        retries += 1;
      } else {
        throw e;
      }
    }
  }
}

async function callNewPackager(dependencies: Object) {
  const dependencyUrl = dependenciesToQuery(dependencies);

  const result = await requestPackager(dependencyUrl);
  return result;
}

export default function fetch(actions, id: string, npmDependencies: Object) {
  return async (dispatch: Function) => {
    if (Object.keys(npmDependencies).length !== 0) {
      dispatch({ type: actions.REQUEST, initial: true, id });
      // New Packager flow
      try {
        const result = await callNewPackager(npmDependencies);

        dispatch({ type: actions.SUCCESS, id, result });
        return result;
      } catch (e) {
        logError(e, { level: 'error', service: 'packager' });
        dispatch({ type: actions.FAILED, id });
      }
    }
    return false;
  };
}