import { useState, useEffect } from 'react';
import { observable, autorun } from 'mobx';

const OBSERVERS = Symbol('observers');

export function create(source) {
    Object.keys(source).forEach(prop => {
        let desc = Object.getOwnPropertyDescriptor(source, prop);
        desc = observable(source, prop, desc);
        Object.defineProperty(source, prop, desc);
    });

    source[OBSERVERS] = [];

    let previous = null;
    autorun(function() {
        const current = JSON.stringify(source);

        if (previous && current !== previous) {
            source[OBSERVERS].forEach(f => f({}));
        }

        previous = current;
    });

    return source;
}

export function use(source) {
    const invokeRender = useState({})[1];

    useEffect(function() {
        source[OBSERVERS].push(invokeRender);
        return () => (source[OBSERVERS] = source[OBSERVERS].filter(f => f !== invokeRender));
    });

    return source;
}
