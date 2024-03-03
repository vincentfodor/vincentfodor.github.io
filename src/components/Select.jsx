import classNames from "classnames";

export const Select = ({ children, className, label, optional, ...props }) => {
    return (
        <div>
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
                    className,
                    "inline-block p-2 bg-gray-100 rounded-md overflow-hidden"
                )}
            >
                <select
                    className={classNames(
                        className,
                        "bg-transparent pr-2 outline-none"
                    )}
                    {...props}
                >
                    {children}
                </select>
            </div>
        </div>
    );
};
