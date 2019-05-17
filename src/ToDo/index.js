import React from 'react';

import Controller from './Controller';


// We should create data here instead of Model and pass it wherever we want

export default
function() {
    return <>
        <Controller />
        <div style={{ position: 'absolute', right: 0 }}>
            <Controller />
        </div>
    </>
}
