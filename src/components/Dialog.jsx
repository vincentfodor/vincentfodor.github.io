import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const Dialog = ({
    children,
    className,
    open,
    onClose,
    title,
    buttons,
    onSubmit,
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
                <form
                    className="flex flex-col bg-white w-full rounded-lg max-h-full sm:w-96 drop-shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={onSubmit}
                >
                    <div className="flex border-b p-4 text-lg font-bold items-center">
                        <h3 className="grow text-base">{title}</h3>
                        <Button
                            className="bg-transparent text-black !p-2"
                            onClick={onClose}
                        >
                            <FontAwesomeIcon
                                icon={faClose}
                                size="md"
                                className="text-black"
                            />
                        </Button>
                    </div>
                    <div className="p-4 grow overflow-y-auto">{children}</div>
                    {!!buttons && (
                        <div className="p-4 text-right border-t">{buttons}</div>
                    )}
                </form>
            </div>
        </div>
    );
};
