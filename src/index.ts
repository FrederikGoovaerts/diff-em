import {
  diff as diffObject,
  addedDiff as addedDiffObject,
  updatedDiff as updatedDiffObject,
  deletedDiff as deletedDiffObject,
} from './diffObject/diff';

export { diffObject, addedDiffObject, updatedDiffObject, deletedDiffObject };

import {
  diff as diffPath,
  addedDiff as addedDiffPath,
  updatedDiff as updatedDiffPath,
  deletedDiff as deletedDiffPath,
} from './diffPath/diff';

export { diffPath, addedDiffPath, updatedDiffPath, deletedDiffPath };

import { diff as diffPatch } from './diffPatch/diff';

export { diffPatch };
