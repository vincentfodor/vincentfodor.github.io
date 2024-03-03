import classNames from "classnames";

export const Header = ({ className, title, rightText, ...props }) => {
    return (
        <div
            className={classNames(
                className,
                "fixed md:relative w-full flex p-4 border-b border-gray-300 items-center z-10 bg-white"
            )}
        >
            <div className="grow">
                {!!title && <h1 className="font-bold">{title}</h1>}
            </div>
            {!!rightText && <span>{rightText}</span>}
        </div>
    );
};
