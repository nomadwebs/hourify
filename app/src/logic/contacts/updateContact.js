import { validate, errors } from "com";

const { SystemError } = errors;

export default function (contactId, name, email, phone, contactType, nif, address, city, postalCode, website, notes, linkedUserId, numberOfSessions, sessionsRecurrency, timeSchedule) {
    validate.id(contactId, 'contactId');
    validate.text(name, 'name');
    /* if (email) validate.email(email);
    if (phone) validate.text(phone, 'phone');
    validate.text(contactType, 'contactType');
    if (nif) validate.text(nif, 'nif');
    if (address) validate.text(address, 'address');
    if (city) validate.text(city, 'city');
    if (postalCode) validate.text(postalCode, 'postalCode');
    if (website) validate.text(website, 'website');
    if (notes) validate.text(notes, 'notes');
    if (linkedUserId) validate.id(linkedUserId, 'linkedUserId');
    if (numberOfSessions) validate.number(numberOfSessions, 'numberOfSessions');
    if (sessionsRecurrency) validate.text(sessionsRecurrency, 'sessionsRecurrency');
    if (timeSchedule) validate.text(timeSchedule, 'timeSchedule'); */


    // Create the request body with only the defined values
    const body = {
        name,
        email,
        phone,
        contactType,
        nif,
        address,
        city,
        postalCode,
        website,
        notes,
        linkedUserId,
        numberOfSessions,
        sessionsRecurrency,
        timeSchedule
    };

    /*  // Only add optional parameters if they are provided
     if (email) body.email = email;
     if (phone) body.phone = phone;
     if (contactType) body.contactType = contactType;
     if (nif) body.nif = nif;
     if (address) body.address = address;
     if (city) body.city = city;
     if (postalCode) body.postalCode = postalCode;
     if (website) body.website = website;
     if (notes) body.notes = notes;
     if (linkedUserId) body.linkedUserId = linkedUserId;
     if (numberOfSessions) body.numberOfSessions = numberOfSessions;
     if (sessionsRecurrency) body.sessionsRecurrency = sessionsRecurrency;
     if (timeSchedule) body.timeSchedule = timeSchedule; */

    return fetch(`${import.meta.env.VITE_API_URL}/contacts/update/${contactId}`, {
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