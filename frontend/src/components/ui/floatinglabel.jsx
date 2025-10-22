export function FloatingInput({ label, ...props }) {
    return (
      <div className="relative w-full">
        <input
          {...props}
          placeholder=" "
          className="peer w-full border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-teal-500 rounded-none p-2"
        />
        <label
          htmlFor={props.id}
          className="w-40 absolute left-0 text-gray-400 text-sm transition-all
                    
                     peer-placeholder-shown:text-base
                     peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal-500"
        >
          {label}
        </label>
      </div>
    );
  }
  