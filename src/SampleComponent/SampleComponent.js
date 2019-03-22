import React from 'react';
import { use, SampleStore } from 'store';

export default
function SampleComponent() {
    use(SampleStore);
    // or
    // const { value, arrValue } = use(SampleStore);

    return (
        <div>
            <div>First component:</div>
            <div>{SampleStore.value}</div>
            <div>{SampleStore.arrValue.join(',')}</div>
            <button type="button" onClick={() => SampleStore.incValue()}>+1</button>
        </div>
    )
}
