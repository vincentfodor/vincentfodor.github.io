import classNames from "classnames";

export const Header = ({ className, title, rightText, ...props }) => {
  return (
    <div
      className={classNames(
        className,
        "w-full flex p-4 border-b border-gray-300"
      )}
    >
      <div className="grow">
        {!!title && <h1 className="font-bold">{title}</h1>}
      </div>
      {!!rightText && <span>{rightText}</span>}
    </div>
  );
};
