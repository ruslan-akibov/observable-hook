import { useState, useEffect } from 'react';
import { observable, autorun } from 'mobx';

export default function useObservable(target) {
    Object.keys(target).forEach(prop => {
        let desc = Object.getOwnPropertyDescriptor(target, prop);
        desc = observable(target, prop, desc);
        Object.defineProperty(target, prop, desc);
    });

    let connectedComponents = [];

    let previous = null;
    autorun(function() {
        const current = JSON.stringify(target);

        if (previous && current !== previous) {
            connectedComponents.forEach(f => f({}));
        }

        previous = current;
    });

    return [
        target,
        function() {
            const invokeRender = useState({})[1];

            useEffect(function() {
                connectedComponents.push(invokeRender);
                return () => (connectedComponents = connectedComponents.filter(f => f !== invokeRender));
            });

            return target;
        }
    ]
}
