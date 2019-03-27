class TaskListBasic {
    tasks = [];
    isLoading = false;

    get(id) {
        return this.tasks.find(t => t.id === id) || {}
    }

    @loading
    async load() {
        this.tasks = await AJAX_fetch('todo-tasks') || []
    }

    // why
    async save() {
        this.tasks = this.tasks.sort(( a, b ) => { return (( a.name < b.name )? 1 : -1) });
        await AJAX_store('todo-tasks', this.tasks)
    }


    async append(name, description) {
        const id = Math.random();

        this.tasks.push({
            id,
            name,
            description,
            marked: false,
            locked: false
        });

        await this.update(id, name, description)
    }

    @loading
    async update(id, name, description) {
        const task = this.get(id);

        task.name = name;
        task.description = description;

        await this.save();
    }

    @loading
    async remove(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        await this.save();
    }
}

class TaskList extends TaskListBasic {
    mark(id) {
        const task = this.get(id);
        task.marked = !task.marked;

        this.save();
    }

    lock(id) {
        this.get(id).locked = true;
    }

    unlock(id) {
        this.get(id).locked = false;
    }
}


export default new TaskList();



// libs
function AJAX_fetch(key) {
    return new Promise(r => setTimeout(() => r(JSON.parse(localStorage[key] || '""')), 1000))
}

function AJAX_store(key, value) {
    return new Promise(r => setTimeout(() => { localStorage[key] = JSON.stringify(value); r(); }, 2000))

}

function loading(elementDescriptor) {
    const propertyDescriptor = elementDescriptor.descriptor;

    const original = propertyDescriptor.value;

    propertyDescriptor.value = async function(...args) {
        this.isLoading = true;
        const result = await original.apply(this, args);
        this.isLoading = false;

        return result;
    }

    return elementDescriptor;
}
