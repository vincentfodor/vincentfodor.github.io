import classNames from "classnames";

export const Header = ({ className, title, ...props }) => {
  return (
    <div
      className={classNames(className, "w-full p-4 border-b border-gray-300")}
    >
      {!!title && <h1 className="font-bold">{title}</h1>}
    </div>
  );
};
