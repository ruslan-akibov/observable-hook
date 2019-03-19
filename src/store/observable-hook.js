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
        if (!previous) {
            previous = JSON.stringify(target);
            return;
        }

        const current = JSON.stringify(target);
        if (current !== previous) {
            connectedComponents.forEach(f => f(Math.random()));

            previous = current;
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
