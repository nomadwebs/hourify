export default function Textarea({ id, defaultValue, placeholder, personalClasses = '', maxLength }) {
    return (
        <textarea
            id={id}
            defaultValue={defaultValue}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full py-2 px-3 text-blue-950 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary ${personalClasses}`}
        />
    )
}