import { useState } from 'react'
import logic from '../../logic'
import { errors } from 'com'

const { SystemError } = errors

import useContext from '../useContext'

import { Button, Field, Input, Label } from '../../library'

export default function CreateUserByProvider({ onUserCreated }) {
    const { alert } = useContext()

    const handleSubmit = async (event) => {
        event.preventDefault()

        const { target: form } = event
        const {
            name: { value: name },
            email: { value: email },
            username: { value: username }
        } = form

        try {
            await logic.createUserByProvider(name, email, username)
            form.reset()
            alert('New user was successfully created and will receive an email with login details.\nNow you can assign a pack to the user.', 'success')
            onUserCreated()
        } catch (error) {
            if (error instanceof SystemError) alert('Sorry, try again later.')
            else alert(error.message)
            console.error(error)
        }
    }

    const handleCancel = () => {
        onUserCreated()
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-2xl font-bold text-color_darkBlue mb-4">Create New User</h2>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                <Field>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="User's name"
                        required
                        className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                    />
                </Field>

                <Field>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="User's email"
                        required
                        className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                    />
                </Field>

                <Field>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="User's username"
                        required
                        className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary"
                    />
                </Field>

                <Button type="submit" className="bg-color_primary text-white px-4 py-2 rounded-md hover:bg-color_primaryHover transition">Create User</Button>
                <Button type="button" className="bg-color_primary text-white px-4 py-2 rounded-md hover:bg-color_primaryHover transition" onClick={handleCancel}>Cancel</Button>
            </form>
        </div>
    )
} 