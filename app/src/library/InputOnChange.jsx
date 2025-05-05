export default function InputOnChange({ type, id, value, defaultValue, placeholder, required, onChange, personalClasses = '' }) {

    // Determina qué prop usar para el valor
    const inputValue = value !== undefined ? value : defaultValue;

    return <input
        placeholder={placeholder}
        type={type}
        id={id}
        className={`w-full py-2 px-3 text-blue-950 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-color_primary ${personalClasses}`}
        value={inputValue}
        onChange={onChange}
        //defaultValue={defaultValue}
        required={required} />
}