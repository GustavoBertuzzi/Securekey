
export default function InputLabel(props) {

    return (
        <div className="flex flex-col">
            <label 
                htmlFor={props.id}
                className="text-gunmetal"
            >
                {props.labelText}
            </label>
            
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                autoComplete={props.name}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                required={props.required}
                className="w-full border border-cadet-gray p-2 rounded focus:outline-none focus:ring-2 focus:ring-medium-slate-blue"
            />
        </div>
    )
}