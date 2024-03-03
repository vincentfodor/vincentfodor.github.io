import classNames from "classnames";
import { Select } from "../Select";

export const CategorySelect = ({
    savedItems,
    className,
    optional,
    ...props
}) => {
    const renderOptions = [
        ...new Set(
            savedItems
                .filter((item) => item.category)
                .map((item) => item.category)
        ),
    ].map((category) => (
        <option key={`category-option-${category}`}>{category}</option>
    ));

    return (
        <div>
            <Select className={classNames("w-full", className)} {...props}>
                <option value="">Kategorie auswählen</option>
                {renderOptions}
            </Select>
        </div>
    );
};
