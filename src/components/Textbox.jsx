import classNames from "classnames";

export const Textbox = ({ className, ...props }) => {
  return (
    <div className={classNames(className, "bg-gray-300")}>
      <input
        className="w-full border-0 bg-transparent p-2 outline-none"
        {...props}
      />
    </div>
  );
};
