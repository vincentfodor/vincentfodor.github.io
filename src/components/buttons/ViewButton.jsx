import classNames from "classnames";
import { Button } from "../Button";

export const ViewButton = ({ active, className, children, ...props }) => {
    return (
        <Button
            className={classNames(
                "!text-black justify-center transition-all",
                {
                    "bg-neutral-100": !active,
                    "bg-neutral-200 font-semibold": active,
                },
                className
            )}
            {...props}
        >
            {children}
        </Button>
    );
};
