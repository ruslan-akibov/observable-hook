import React from 'react';
import { SampleStore } from 'store';

export default
class SampleComponent2 extends React.Component {
    render() {
        return (
            <div>
                <div>Second component:</div>
                <button type="button" onClick={() => SampleStore.pushValue()}>Push +1</button>
            </div>
        )
    }
}
