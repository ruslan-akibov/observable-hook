var visited;
var result;

var objectCheck = Object.prototype.toString;
var arrayCheck = Array.prototype.toString;

function _stringify(obj) {
    if (!obj) {
        result.push(obj);
        return;
    }

    var toString = obj.toString;
    var isObject = (toString === objectCheck);
    var isArray = (toString === arrayCheck);

    if (isObject || isArray) {
        if (visited.get(obj)) {
            result.push('{}');
            return;
        }

        visited.set(obj, 1);

        for (var key in obj) {
            if (!isArray) {
                result.push(key + ':');
            }

            _stringify(obj[key]);
            result.push(',');
        }
    } else {
        result.push(obj);
    }
}

export default function stringify(obj) {
    result = [];
    visited = new WeakMap();

    _stringify(obj);

    return result.join('');
}
