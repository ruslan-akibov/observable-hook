const IS_PROXY = Symbol('is proxy');
const IS_PROPS_OBSERVER = Symbol('is root own props observer');

export function isProxy(source) {
    return !!source[IS_PROXY];
}

export default
function proxy(source, callback) {
    if (typeof source !== 'object' || source == null) {
        return source
    }

    if (isProxy(source)) {
        return source
    }

    source[IS_PROXY] = true;


    Object.keys(source).forEach(prop => {
        let desc = Object.getOwnPropertyDescriptor(source, prop);
        desc.value = proxy(desc.value, callback);
        Object.defineProperty(source, prop, desc);
    });

    return new Proxy(source, {
        set: function(target, prop, newval) {
            if (typeof prop !== 'symbol') {
                target[prop] = proxy(newval, callback);
                callback();
            } else {
                target[prop] = newval;
            }

            return true;
        },
        defineProperty: function(target, name, propertyDescriptor) {
            propertyDescriptor.value = proxy(propertyDescriptor.value, callback);
            Object.defineProperty(target, name, propertyDescriptor);

            callback();
            return true;
        },
        deleteProperty: function(target, name) {
            delete target[name];

            callback();
            return true;
        }
    });
}

export function isPropsObserver(source) {
    return !!source[IS_PROPS_OBSERVER];
}

export function observeRootProps(source, listener) {
    Object.keys(source).forEach(prop => {
        let desc = Object.getOwnPropertyDescriptor(source, prop);

        let initialValue = proxy(desc.value, listener);
        delete desc.value;
        delete desc.writable;

        desc.set = function(newValue) {
            initialValue = proxy(newValue, listener);
            listener();
        };
        desc.get = function() {
            return initialValue
        };

        Object.defineProperty(source, prop, desc);
    });

    source[IS_PROPS_OBSERVER] = true;
}
