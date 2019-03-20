export default class SampleStore {
    value = 0;
    arrValue = [];

    // 'static' props will be skipped in serialization (and reactions as well)
    // but you still can access it with '<Object-Instance>.constructor.<Prop-Name>'
    static bigData = {};

    incValue() {
        this.value++;
    }

    pushValue() {
        this.arrValue.push(this.value);
    }
}
