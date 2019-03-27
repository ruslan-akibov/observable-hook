export function AJAX_fetch(key) {
    return new Promise(r => setTimeout(() => r(JSON.parse(localStorage[key] || '""')), 1000))
}

export function AJAX_store(key, value) {
    return new Promise(r => setTimeout(() => { localStorage[key] = JSON.stringify(value); r(); }, 2000))

}

export function loading(elementDescriptor) {
    const propertyDescriptor = elementDescriptor.descriptor;

    const original = propertyDescriptor.value;

    propertyDescriptor.value = async function(...args) {
        this.isLoading = true;
        const result = await original.apply(this, args);
        this.isLoading = false;

        return result;
    };

    return elementDescriptor;
}
