import classNames from "classnames";
import { Button } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ViewButton = ({ active, className, children, icon, ...props }) => {
    return (
        <Button
            className={classNames(
                "!text-black justify-center transition-all",
                {
                    "bg-transparent": !active,
                    "bg-neutral-100 font-semibold": active,
                },
                className
            )}
            {...props}
        >
            {!!icon && (
                <FontAwesomeIcon icon={icon} size="sm" className="mr-2" />
            )}
            {children}
        </Button>
    );
};
