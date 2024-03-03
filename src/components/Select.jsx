import classNames from "classnames";

export const Select = ({ children, className, ...props }) => {
    return (
        <div
            className={classNames(
                className,
                "inline-block p-2 bg-gray-200 rounded-md overflow-hidden"
            )}
        >
            <select className="bg-transparent pr-2" {...props}>
                {children}
            </select>
        </div>
    );
};
