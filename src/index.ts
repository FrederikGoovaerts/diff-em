import { diff as diffObject } from './diffObject/diff';
import { addedDiff as addedDiffObject } from './diffObject/addedDiff';
import { updatedDiff as updatedDiffObject } from './diffObject/updatedDiff';
import { deletedDiff as deletedDiffObject } from './diffObject/deletedDiff';

export { diffObject, addedDiffObject, updatedDiffObject, deletedDiffObject };

import { diff as diffPath } from './diffPath/diff';
import { addedDiff as addedDiffPath } from './diffPath/addedDiff';
import { updatedDiff as updatedDiffPath } from './diffPath/updatedDiff';
import { deletedDiff as deletedDiffPath } from './diffPath/deletedDiff';

export { diffPath, addedDiffPath, updatedDiffPath, deletedDiffPath };
