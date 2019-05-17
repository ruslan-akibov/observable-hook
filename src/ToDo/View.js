import React from 'react';

// You could just use 'react-hoox' instead
import { use } from 'observable-hook';

import Model from './Model';


export default
function ({
    onEdit,
    onAdd,

    isEditing,
    editForm : {
        name,
        description
    },
    onChange,
    onSave,
    onCancel
}) {
    const {
        tasks,
        isLoading
    } = use(Model);

    return (
        <div style={{ opacity: isLoading ? 0.3 : 1 }}>
            <div><b>ToDo List</b></div>
            {
                tasks.map(({ id, name, marked, locked }, idx) => (
                    <div key={id}>
                        <span
                            style={{
                                fontWeight: marked ? 'bold' : 'normal',
                                color: locked ? '#ff0000' : '#000000'
                            }}
                        >
                            {name}
                        </span>

                        {
                            !isEditing &&
                            <>
                                <button type="button" disabled={locked} onClick={() => Model.mark(id)}>Mark</button>
                                <button type="button" disabled={locked} onClick={() => onEdit(id)}>Edit</button>
                                <button type="button" disabled={locked} onClick={() => Model.remove(id)}>Remove</button>
                            </>
                        }
                    </div>
                ))
            }

            {
                isEditing
                    ?
                        <>
                            <input
                                type="text"
                                data-field-id="name"
                                value={name}
                                onChange={onChange}
                            />
                            <br />
                            <textarea
                                data-field-id="description"
                                value={description}
                                onChange={onChange}
                            />
                            <br/>

                            <button type="button" onClick={onSave}>Save</button>
                            <button type="button" onClick={onCancel}>Cancel</button>
                        </>
                    :
                        <>
                            <button type="button" onClick={onAdd}>Add</button>
                        </>
            }
        </div>
    )
}
