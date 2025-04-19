
export default function Button(props) {

    return (
        <button
            type={props.type}
            value={props.value}
            className="bg-medium-slate-blue hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
            {props.text}
        </button>
    )
}