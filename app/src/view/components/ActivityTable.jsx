import { useState, useContext, useEffect } from 'react'
import { getDecimalToTimeFormat } from "../../logic/helpers"
import { Context } from '../useContext'
import { getUserNameByUserId } from '../../logic/users'
import addActivityComment from '../../logic/activities/addActivityComment'

export default function ActivityTable({ activities, packInfo }) {
    const [expandedComments, setExpandedComments] = useState({})
    const [newComment, setNewComment] = useState({})
    const [commentText, setCommentText] = useState({})
    const [userNames, setUserNames] = useState({})
    const { alert } = useContext(Context)

    const toggleComments = (activityId) => {
        setExpandedComments(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }))
    }

    const handleAddComment = (activityId) => {
        setNewComment(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }))
    }

    const handleSubmitComment = async (activityId) => {
        try {
            const comment = commentText[activityId]
            if (!comment || comment.trim() === '') {
                alert('Comment cannot be empty')
                return
            }

            await addActivityComment(activityId, comment)

            // Update the activity with the new comment
            const activityIndex = activities.findIndex(activity => activity.id === activityId)
            if (activityIndex !== -1) {
                // Add the new comment to the existing activity
                if (!activities[activityIndex].comments) {
                    activities[activityIndex].comments = []
                }
                activities[activityIndex].comments.push({
                    commentDate: new Date(),
                    comment: comment
                })
            }

            // Clear the comment input and close the form
            setCommentText(prev => ({ ...prev, [activityId]: '' }))
            setNewComment(prev => ({ ...prev, [activityId]: false }))

            // Force a re-render to show the new comment
            setExpandedComments(prev => ({ ...prev, [activityId]: true }))

            // Refresh the activities to get the updated data with user information
            window.dispatchEvent(new CustomEvent('refreshActivities'))

        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        const fetchUserNames = async () => {
            const names = {}
            for (const activity of activities) {
                if (activity.comments) {
                    for (const comment of activity.comments) {
                        if (!names[comment.userId]) {
                            try {
                                const userName = await getUserNameByUserId(comment.userId)
                                names[comment.userId] = userName
                            } catch (error) {
                                names[comment.userId] = 'Current user'
                            }
                        }
                    }
                }
            }
            setUserNames(names)
        }

        fetchUserNames()
    }, [activities])

    if (activities.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No activity records found for this pack.
            </div>
        )
    }

    const renderComments = (activity) => {
        if (!activity.comments || activity.comments.length === 0) return null

        return (
            <div className="mt-2 space-y-2">
                {activity.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md text-sm">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-600">{comment.comment}</span>
                                <span className="text-xs text-gray-400">
                                    {new Date(comment.commentDate).toLocaleString()}
                                </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                By: {userNames[comment.userId] || 'Loading...'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderCommentInput = (activityId) => {
        if (!newComment[activityId]) return null

        return (
            <div className="mt-2">
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                    placeholder="Write your comment here..."
                    value={commentText[activityId] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [activityId]: e.target.value }))}
                />
                <div className="flex justify-end mt-2 space-x-2">
                    <button
                        onClick={() => {
                            setNewComment(prev => ({ ...prev, [activityId]: false }))
                            setCommentText(prev => ({ ...prev, [activityId]: '' }))
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSubmitComment(activityId)}
                        className="px-3 py-1 text-sm bg-color_darkBlue text-white rounded-md hover:bg-color_lightBlue"
                    >
                        Send
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Table for medium and large screens */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.slice().reverse().map((activity) => {
                            // Determine operation display text and color
                            let operationColor
                            if (activity.operation === 'manual adjustment') {
                                operationColor = 'text-purple-800'
                            } else {
                                const isAddOperation = activity.operation === 'add'
                                operationColor = isAddOperation ? 'text-green-600' : 'text-red-600'
                            }

                            let operationText
                            if (activity.operation === 'manual adjustment') {
                                operationText = 'Manual Adjustment'
                            } else if (packInfo.unit === 'hours') {
                                operationText = activity.operation === 'add'
                                    ? `+ ${getDecimalToTimeFormat(activity.quantity)} h`
                                    : `- ${getDecimalToTimeFormat(activity.quantity)} h`
                            } else {
                                operationText = activity.operation === 'add'
                                    ? `+ ${activity.quantity} un.`
                                    : `- ${activity.quantity} un.`
                            }

                            // Format the remaining quantity
                            const remainingText = packInfo.unit === 'hours'
                                ? `${getDecimalToTimeFormat(activity.remainingQuantity)} h`
                                : `${activity.remainingQuantity} un.`

                            return (
                                <>
                                    <tr key={activity.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{activity.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${operationColor}`}>{operationText}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{remainingText}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleComments(activity.id)}
                                                    className="text-gray-500 hover:text-color_darkBlue flex items-center"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                    </svg>
                                                    {activity.comments && activity.comments.length > 0 && (
                                                        <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                                                            {activity.comments.length}
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleAddComment(activity.id)}
                                                    className="text-gray-500 hover:text-color_darkBlue"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {(expandedComments[activity.id] || newComment[activity.id]) && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                                {expandedComments[activity.id] && renderComments(activity)}
                                                {renderCommentInput(activity.id)}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cards for small screens */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {activities.slice().reverse().map((activity) => {
                    // Determine operation display text and color
                    let operationColor
                    if (activity.operation === 'manual adjustment') {
                        operationColor = 'text-purple-800'
                    } else {
                        const isAddOperation = activity.operation === 'add'
                        operationColor = isAddOperation ? 'text-green-600' : 'text-red-600'
                    }

                    let operationText
                    if (activity.operation === 'manual adjustment') {
                        operationText = 'Manual Adjustment'
                    } else if (packInfo.unit === 'hours') {
                        operationText = activity.operation === 'add'
                            ? `+ ${getDecimalToTimeFormat(activity.quantity)} h`
                            : `- ${getDecimalToTimeFormat(activity.quantity)} h`
                    } else {
                        operationText = activity.operation === 'add'
                            ? `+ ${activity.quantity} un.`
                            : `- ${activity.quantity} un.`
                    }

                    // Format the remaining quantity
                    const remainingText = packInfo.unit === 'hours'
                        ? `${getDecimalToTimeFormat(activity.remainingQuantity)} h`
                        : `${activity.remainingQuantity} un.`

                    return (
                        <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="bg-gray-700 text-white py-2 px-4 flex justify-between items-center">
                                <h3 className="font-semibold text-sm truncate">{new Date(activity.date).toLocaleDateString()}</h3>
                                <span className="text-xs">{new Date(activity.date).toLocaleTimeString()}</span>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                                    <span className="text-gray-600 font-medium">Operation:</span>
                                    <span className={`text-right font-semibold ${operationColor}`}>{operationText}</span>

                                    <span className="text-gray-600 font-medium">Remaining:</span>
                                    <span className="text-right font-semibold">{remainingText}</span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => toggleComments(activity.id)}
                                            className="text-gray-500 hover:text-color_darkBlue flex items-center space-x-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            <span className="text-sm">Comments</span>
                                            {activity.comments && activity.comments.length > 0 && (
                                                <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                                                    {activity.comments.length}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleAddComment(activity.id)}
                                            className="text-gray-500 hover:text-color_darkBlue"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                    {expandedComments[activity.id] && renderComments(activity)}
                                    {renderCommentInput(activity.id)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}