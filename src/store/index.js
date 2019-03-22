export { use } from './observable-hook';

import SampleStoreClass from './SampleStore';
export const SampleStore = new SampleStoreClass();
// or
// = use(new SampleStoreClass()); - to 'trigger' first usage and allow to 'store' not-yet-observable values
