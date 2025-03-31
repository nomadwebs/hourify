import { validate, errors } from "com";

const { SystemError } = errors;

export default function (taskId, description, dueDate, customer, priority, status, notes) {
    validate.id(taskId, 'taskId');
    validate.description(description, 'description');

    if (dueDate !== null && dueDate !== undefined)
        validate.date(dueDate);

    if (customer !== null && customer !== undefined)
        validate.id(customer, 'customer');

    validate.taskPriority(priority, 'priority');
    validate.taskStatus(status, 'status');

    if (notes !== null && notes !== undefined)
        validate.text(notes, 'notes');

    // Create the request body with only the defined values
    const body = {
        description,
        priority,
        status
    };

    // Only add optional parameters if they are provided
    if (dueDate) body.dueDate = dueDate.toISOString();
    if (customer) body.customer = customer;
    if (notes) body.notes = notes;

    return fetch(`${import.meta.env.VITE_API_URL}/tasks/update/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
        },
        body: JSON.stringify(body)
    })
        .catch(error => { throw new SystemError(error.message); })
        .then(res => {
            if (res.ok)
                return;

            return res.json()
                .catch(error => { throw new SystemError(error.message); })
                .then(({ error, message }) => {
                    throw new errors[error](message);
                });
        });
} 