import classNames from "classnames";

export const Textbox = ({ className, ...props }) => {
  return (
    <div
      className={classNames(
        className,
        "bg-gray-200 rounded-md overflow-hidden"
      )}
    >
      <input
        className="w-full border-0 bg-transparent p-2 outline-none"
        {...props}
      />
    </div>
  );
};
