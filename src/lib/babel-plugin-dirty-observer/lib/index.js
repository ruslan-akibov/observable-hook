Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function(args) {
    var t = args.types;

    var window__r_a_17_ = t.memberExpression(
        t.identifier('window'),
        t.identifier('__r_a_17_')
    );

    var window__r_a_27_ = t.memberExpression(
        t.identifier('window'),
        t.identifier('__r_a_27_')
    );

    // if (window.__r_a_17_) window.__r_a_27_();
    // todo: 'winodw.__r_a_17_ === true' would be faster?
    var injection = t.IfStatement(
        window__r_a_17_,
        t.expressionStatement(t.callExpression(window__r_a_27_, []))
    );


    return {
        visitor: {
            // includes any functions, classes, etc...
            Function(path) {
                if (this.file.opts.filename.indexOf('node_modules') < 0) {
                    var body = path.get('body');

                    if (body.type !== 'BlockStatement') {
                        // one-line arrow function
                        body.replaceWith(
                            t.BlockStatement([
                                injection,
                                t.ReturnStatement(body.node)
                            ])
                        );
                    } else {
                        // check if already injected
                        var children = body.node.body[0] ? body.node.body : [ body.node.body ];
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];

                            if (child.type === 'IfStatement') {
                                if (child.test.type === 'MemberExpression') {
                                    if (child.test.property.name === '__r_a_17_') {
                                        return;
                                    }
                                }
                            }
                        }

                        body.unshiftContainer(
                            'body',
                            injection
                        );
                    }
                }
            }

            // new Function(<'', >? '<injection-here>; ... ');

            // AwaitExpression, YieldExpression --> ([(await/yield ...), window.__r_a_17_ ? window.__r_a_27_() : 0][0])
            // we still can rely on transpiler for now, but in future will need to do it as well
        }
    }
}


if (typeof window !== 'undefined') {
    window.__r_a_17_ = false;
    window.__r_a_27_ = function trigger() {
        if (window.__r_a_17_) {
            window.__r_a_17_ = false;

            setTimeout(function() {
                window.requestAnimationFrame(function() {
                    for (var i = 0; i < observing.length; i++) {
                        var newHash = observing[i].hashFunction(observing[i].obj);

                        if (newHash !== observing[i].hash) {
                            observing[i].hash = newHash;

                            for (var j = 0; j < observing[i].callbacks.length; j++) {
                                observing[i].callbacks[j](observing[i].obj);
                            }
                        }
                    }

                    window.__r_a_17_ = !!observing.length;
                })
            }, 16); // or 0?
        }
    }


    var observing = [];
    function isObserving(obj) {
        for (var i = 0; i < observing.length; i++) {
            if (observing[i].obj === obj) {
                return i;
            }
        }

        return -1;
    }


    exports.observe = function(obj, callback, options) {
        var hashFunction = (options || {}).hashFunction || JSON.stringify;

        var idx = isObserving(obj);
        if (idx < 0) {
            idx = observing.push({
                obj: obj,
                hashFunction: hashFunction,
                hash: hashFunction(obj),
                callbacks: []
            }) - 1;
        }

        observing[idx].callbacks.push(callback);

        window.__r_a_17_ = true;

        // ? trigger()

        return function() {
            var idx = isObserving(obj);
            if (idx < 0) {
                return;
            }

            for (var i = 0; i < observing[idx].callbacks.length; i++) {
                if (observing[idx].callbacks[i] === callback) {
                    observing[idx].callbacks.splice(i, 1);

                    setTimeout(function() {
                        var idx = isObserving(obj);
                        if (idx < 0) {
                            return;
                        }

                        if (!observing[idx].callbacks.length) {
                            observing.splice(idx, 1);
                        }
                    }, 500);

                    break;
                }
            }
        }
    }
}
