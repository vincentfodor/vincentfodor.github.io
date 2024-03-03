import classNames from "classnames";

export const Textbox = ({ className, label, optional, ...props }) => {
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
            <div className={"bg-gray-100 rounded-md overflow-hidden"}>
                <input
                    className="w-full border-0 bg-transparent p-2 outline-none"
                    {...props}
                />
            </div>
        </div>
    );
};
