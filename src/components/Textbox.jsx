import classNames from "classnames";

export const Textbox = ({ className, label, optional, error, ...props }) => {
    return (
        <div className={className}>
            {!!label && (
                <label className="flex items-center mb-1">
                    {label}{" "}
                    {optional && (
                        <span className="text-gray-400 ml-1 text-sm">
                            (optional)
                        </span>
                    )}
                </label>
            )}
            <div
                className={classNames(
                    "bg-gray-100 rounded-md overflow-hidden",
                    {
                        "border border-red-500": !!error,
                    }
                )}
            >
                <input
                    className="w-full border-0 bg-transparent p-2 outline-none"
                    {...props}
                />
            </div>
            {!!error && (
                <span className="text-base text-red-500 block mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};
