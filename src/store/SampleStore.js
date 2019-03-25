class SampleStoreBaseClass {
    value = 0;

    incValue() {
        this.value++;
    }
}

export default class SampleStore extends SampleStoreBaseClass {
    arrValue = [];

    pushValue() {
        this.arrValue.push(this.value);
    }
}
