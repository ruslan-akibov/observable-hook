import { useState, useEffect } from 'react';
import { observable, autorun } from 'mobx';

export default function useObservable(source) {
    Object.keys(source).forEach(prop => {
        let desc = Object.getOwnPropertyDescriptor(source, prop);
        desc = observable(source, prop, desc);
        Object.defineProperty(source, prop, desc);
    });

    const target = source;

    let connectedComponents = [];

    let previous = null;
    autorun(function() {
        if (!previous) {
            previous = JSON.stringify(target);
            return;
        }

        const current = JSON.stringify(target);
        if (current !== previous) {
            connectedComponents.forEach(f => {
                f(Math.random());
            });
        }
    });

    return [
        target,
        function() {
            const invokeRender = useState(target)[1];

            useEffect(function() {
                connectedComponents.push(invokeRender);
                return () => (connectedComponents = connectedComponents.filter(f => f !== invokeRender));
            });

            return target;
        }
    ]
}
