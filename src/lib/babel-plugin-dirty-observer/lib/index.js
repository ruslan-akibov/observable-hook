'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function(args) {
    const t = args.types;
    return {
        visitor: {
            Function(path) {
                if (this.file.opts.filename.indexOf('assets/src/app') > 0) {
                    try {
                        path
                            .get('body')
                            .unshiftContainer(
                                'body',
                                t.expressionStatement(
                                    t.callExpression(
                                        t.memberExpression(
                                            t.identifier('window'),
                                            t.identifier('__42')
                                        ),
                                        []
                                    )
                                )
                            );
                    } catch (err) { }
                }
            }
        }
    };
}
