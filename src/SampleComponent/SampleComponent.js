import React from 'react';
import { useSampleStore } from 'store';

export default
function SampleComponent() {
    const SampleStore = useSampleStore();

    return (
        <div>
            <div>First component:</div>
            <div>{SampleStore.value}</div>
            <div>{SampleStore.arrValue.join(',')}</div>
            <button type="button" onClick={() => SampleStore.incValue()}>+1</button>
        </div>
    )
}
