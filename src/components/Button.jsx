import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export const Button = ({
    children,
    className,
    icon,
    disabled,
    onClick,
    type = "button",
    variant = "primary",
    ...props
}) => {
    const handleClick = (e) => {
        if (!disabled && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            className={classNames(
                className,
                "font-semibold border-0 p-2 px-4 inline-flex items-center rounded-md active:scale-95 active:opacity-70 transition-all",
                {
                    "bg-gray-100 !text-gray-400 cursor-not-allowed pointer-events-none":
                        disabled,
                    "bg-black text-white": variant === "primary",
                    "bg-neutral-200 text-black": variant === "secondary",
                }
            )}
            onClick={handleClick}
            type={type}
            {...props}
        >
            {!!icon && (
                <FontAwesomeIcon size="sm" icon={icon} className="mr-2" />
            )}
            {children}
        </button>
    );
};
