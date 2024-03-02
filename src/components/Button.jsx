import classNames from "classnames";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={classNames(className, "bg-black text-white border-0 p-2")}
      {...props}
    >
      {children}
    </button>
  );
};
