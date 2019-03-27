import React from 'react';

import View from './View';
import Model from './Model';


export default
class extends React.Component {
    state = {
        isEditing: false,
        editForm: {
            name: '',
            description: ''
        }
    }

    componentDidMount() {
        Model.load();
    }


    onEdit = (id) => {
        const { name = '', description = '' } = Model.get(id) || {};

        this.setState({
            isEditing: true,
            editForm: {
                id,
                name,
                description
            }
        })

        Model.lock(id);
    }

    onAdd = () => {
        this.onEdit(null);
    }

    onSave = async () => {
        const { id, name, description } = this.state.editForm;

        Model.unlock(id);

        if (id) {
            await Model.update(id, name, description)
        } else {
            await Model.append(name, description)
        }

        this.setState({ isEditing: false });
    }

    onCancel = () => {
        const { id } = this.state.editForm;

        Model.unlock(id);

        this.setState({ isEditing: false });
    }

    onChange = (event) => {
        const id = event.target.getAttribute('data-field-id');
        this.setState({
            editForm: {
                ...this.state.editForm,
                [id]: event.target.value
            }
        })
    }


    render() {
        const {
            isEditing,
            editForm
        } = this.state;

        return <View
            onEdit={this.onEdit}
            onAdd={this.onAdd}

            isEditing={isEditing}
            editForm={editForm}
            onChange={this.onChange}
            onSave={this.onSave}
            onCancel={this.onCancel}
        />
    }
}
