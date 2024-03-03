import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const Dialog = ({
    children,
    className,
    open,
    onClose,
    title,
    ...props
}) => {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed w-full h-full top-0 left-0 z-50"
            onClick={onClose}
        >
            <div className="absolute w-full h-full bg-black/10" />
            <div className="absolute w-full h-full flex items-center justify-center p-4">
                <div
                    className="bg-white w-full rounded-lg sm:w-96"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex border-b p-4 text-lg font-bold items-center">
                        <h3 className="grow text-base">{title}</h3>
                        <Button
                            className="bg-transparent text-black"
                            onClick={onClose}
                        >
                            <FontAwesomeIcon icon={faClose} size="md" />
                        </Button>
                    </div>
                    <div className="p-4">{children}</div>
                </div>
            </div>
        </div>
    );
};
