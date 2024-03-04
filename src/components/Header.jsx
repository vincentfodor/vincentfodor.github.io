import classNames from "classnames";

export const Header = ({ className, title, rightText, ...props }) => {
    return (
        <div
            className={classNames(
                className,
                "fixed md:relative min-h-[73px] w-full flex p-4 border-b border-gray-300 items-center z-10 bg-white"
            )}
        >
            <div className="grow truncate">
                {!!title && (
                    <h1 className="font-bold whitespace-nowrap truncate">
                        {title}
                    </h1>
                )}
            </div>
            {!!rightText && <span className="ml-2">{rightText}</span>}
        </div>
    );
};
