import { Select } from "../Select";

export const UnitSelect = ({ ...props }) => {
    return (
        <Select {...props}>
            <option value="Stück">Stück</option>
            <option value="g">Gramm</option>
            <option value="kg">Kilogramm</option>
            <option value="l">Liter</option>
            <option value="ml">Milliliter</option>
        </Select>
    );
};
