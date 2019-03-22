export { use } from './observable-hook';
import { create } from './observable-hook';

import SampleStoreClass from './SampleStore';
export const SampleStore = create(new SampleStoreClass());
