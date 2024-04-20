import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export const Button = ({
  children,
  className,
  icon,
  disabled,
  onClick,
  type = "button",
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
        "bg-black text-white border-0 p-2 px-4 inline-flex items-center rounded-md",
        {
          "bg-gray-100 !text-gray-400 cursor-not-allowed pointer-events-none":
            disabled,
        }
      )}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {!!icon && <FontAwesomeIcon size="sm" icon={icon} className="mr-2" />}
      {children}
    </button>
  );
};
