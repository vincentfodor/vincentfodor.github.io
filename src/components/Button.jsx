import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export const Button = ({ children, className, icon, ...props }) => {
    return (
        <button
            className={classNames(
                className,
                "bg-black text-white border-0 p-2 inline-flex items-center"
            )}
            {...props}
        >
            {!!icon && (
                <FontAwesomeIcon size="sm" icon={icon} className="mr-2" />
            )}
            {children}
        </button>
    );
};
