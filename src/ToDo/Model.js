import { use } from 'observable-hook';
import { AJAX_fetch, AJAX_store, loading } from 'lib';


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

    async save() {
        this.sort('name');

        await AJAX_store('todo-tasks', this.tasks)
    }


    async append(name, description) {
        const id = Math.random();

        this.tasks.push({ id });

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

    sort(field) {
        this.tasks.sort(( a, b ) => {
            return (( a[field] < b[field] )? 1 : -1)
        });
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

// export default use(new TaskList());
// you MUST!!! do it if you want to 'store' or 'extend' root props
