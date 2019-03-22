import React from 'react';
import { use, SampleStore } from 'store';

// we can 'store' observable values an use them later
// BUT!!! after first 'use'
use(SampleStore);
const arrRef = SampleStore.arrValue;

export default
class SampleComponent2 extends React.Component {
    render() {
        return (
            <div>
                <div>Second component:</div>
                <button type="button" onClick={() => SampleStore.pushValue()}>Push +1</button>
                <button type="button" onClick={() => arrRef.push(Math.random())}>Push +Random</button>
            </div>
        )
    }
}
