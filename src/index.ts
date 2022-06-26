import {
  diff as diffObject,
  addedDiff as addedDiffObject,
  updatedDiff as updatedDiffObject,
  deletedDiff as deletedDiffObject,
} from './diffObject/diff';

export { diffObject, addedDiffObject, updatedDiffObject, deletedDiffObject };

import { diff as diffPath } from './diffPath/diff';
import { addedDiff as addedDiffPath } from './diffPath/addedDiff';
import { updatedDiff as updatedDiffPath } from './diffPath/updatedDiff';
import { deletedDiff as deletedDiffPath } from './diffPath/deletedDiff';

export { diffPath, addedDiffPath, updatedDiffPath, deletedDiffPath };
