export default class SampleStore {
    value = 0;
    arrValue = [];

    incValue() {
        this.value++;
    }

    pushValue() {
        this.arrValue.push(this.value);
    }
}
