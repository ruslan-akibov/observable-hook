import useObservable from './observable-hook';

import SampleStoreClass from './SampleStore';
export const [
    SampleStore,
    useSampleStore
] = useObservable(new SampleStoreClass());
