import { useState, useEffect } from 'react';
import { observable, autorun } from 'mobx';

const OBSERVERS = Symbol('observers list');
const AUTORUN_INSTANCE = Symbol('mobx autorun()');
const STRINGIFY_CACHE = Symbol('JSON.stringify() cache');

export function use(source) {
    function create() {
        if (source[OBSERVERS]) {
            return
        }

        Object.keys(source).forEach(prop => {
            let desc = Object.getOwnPropertyDescriptor(source, prop);
            desc = observable(source, prop, desc);
            Object.defineProperty(source, prop, desc);
        });

        source[OBSERVERS] = [];
    }

    function start() {
        if (source[AUTORUN_INSTANCE]) {
            return
        }

        source[STRINGIFY_CACHE] = null;

        source[AUTORUN_INSTANCE] = autorun(function () {
            const current = JSON.stringify(source);
            console.log(current);

            if (source[STRINGIFY_CACHE] && current !== source[STRINGIFY_CACHE]) {
                source[OBSERVERS].forEach(f => f({}));
            }

            source[STRINGIFY_CACHE] = current;
        });
    }

    function stop() {
        setTimeout(function() {
            if (source[AUTORUN_INSTANCE] && !source[OBSERVERS].length) {
                source[AUTORUN_INSTANCE]();
                source[AUTORUN_INSTANCE] = null;
                source[STRINGIFY_CACHE] = null;
            }
        }, 500);
    }

    create();

    let invokeRender = null;
    try {
        invokeRender = useState({})[1];
    } catch (error) { }

    if (!invokeRender) {
        return source
    }

    useEffect(function() {
        source[OBSERVERS].push(invokeRender);
        start();

        return () => {
            source[OBSERVERS] = source[OBSERVERS].filter(f => f !== invokeRender);
            stop();
        };
    });

    return source;
}
