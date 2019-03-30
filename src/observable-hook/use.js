import { useState, useEffect } from 'react';
import proxy, { isProxy, isPropsObserver, observeRootProps } from './proxy';

const OBSERVERS = Symbol('observers list');
const STRINGIFY_CACHE = Symbol('JSON.stringify() cache');
const RENDER_TIMER = Symbol('throttling with setTimeout');

export default
function use(source) {
    function listener() {
        if (!source[STRINGIFY_CACHE]) {
            return
        }

        const current = JSON.stringify(source);

        if (current !== source[STRINGIFY_CACHE]) {
            if (source[RENDER_TIMER]) {
                return
            }

            source[RENDER_TIMER] = setTimeout(function() {
                console.log(current, source[OBSERVERS].length);
                source[OBSERVERS].forEach(f => f({}));

                source[RENDER_TIMER] = null;
            }, 16); // or 10? or 0?
        }

        source[STRINGIFY_CACHE] = current;
    }

    function stop() {
        setTimeout(function() {
            if (!source[OBSERVERS].length) {
                source[STRINGIFY_CACHE] = null;
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable
            }
        }, 500);
    }


    if (!source[OBSERVERS]) {
        source[OBSERVERS] = [];
    }

    let invokeRender = null;
    try {
        invokeRender = useState({})[1];
    } catch (error) { }


    let proxied = source;
    let sourceIsProxy = true;
    if (!isProxy(source)) {
        proxied = proxy(source, listener);
        sourceIsProxy = false;
    }

    if (!invokeRender) {
        return proxied;
    } else if (!sourceIsProxy) {
        if (!isPropsObserver(source)) {
            // fallback - we should 'observe' setters inthis case
            observeRootProps(source, listener);
        }
    }


    if (!source[STRINGIFY_CACHE]) {
        source[STRINGIFY_CACHE] = JSON.stringify(source);
    }

    let isUpdateBeforeDidMount = false;
    const temporaryListener = function() {
        isUpdateBeforeDidMount = true;
    };
    source[OBSERVERS].push(temporaryListener);


    useEffect(function() {
        source[OBSERVERS] = source[OBSERVERS].filter(f => f !== temporaryListener);
        source[OBSERVERS].push(invokeRender);

        if (isUpdateBeforeDidMount) {
            invokeRender();
        }

        return () => {
            source[OBSERVERS] = source[OBSERVERS].filter(f => f !== invokeRender);
            stop();
        };
    });

    return proxied
}
