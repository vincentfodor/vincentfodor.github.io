import { useEffect, useState } from "react";
import { Dialog } from "../Dialog";
import { Textbox } from "../Textbox";
import { Button } from "../Button";
import { CategorySelect } from "../selects/CategorySelect";
import { UnitSelect } from "../selects/UnitSelect";

export const AddItemDialog = ({
    itemName: itemNameProp,
    category: categoryProp,
    onSubmit,
    onClose,
    savedItems,
    ...props
}) => {
    const [itemName, setItemName] = useState(itemNameProp);
    const [unit, setUnit] = useState(categoryProp || "Packung");
    const [stack, setStack] = useState(1);
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        setItemName(itemNameProp);
    }, [itemNameProp]);

    useEffect(() => {
        setCategory(categoryProp);
    }, [categoryProp]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (onSubmit) {
            onSubmit({
                name: itemName,
                unit,
                stack,
                category,
                price,
            });
        }

        handleClose();
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }

        init();
    };

    const init = () => {
        setItemName(itemNameProp);
        setCategory(categoryProp);
        setPrice("");
        setStack(1);
        setUnit("Packung");
    };

    const validate = () => {
        if (
            !itemName ||
            savedItems.find(
                (v) => v.name.toLowerCase() === itemName.toLowerCase()
            )
        ) {
            return false;
        }

        return true;
    };

    return (
        <Dialog title="Produkt hinzufügen" onClose={handleClose} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2 mb-4">
                    <Textbox
                        autoFocus={!itemNameProp}
                        type="text"
                        label="Bezeichnung"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        maxLength={24}
                        error={
                            savedItems.find(
                                (v) =>
                                    v.name.toLowerCase() ===
                                    itemName.toLowerCase()
                            ) &&
                            "Ein Produkt mit dieser Bezeichnung exisitiert bereits."
                        }
                    />
                    <div>
                        <label className="block mb-1">Verpackungseinheit</label>
                        <div className="grid grid-cols-2 gap-2">
                            <Textbox
                                type="number"
                                value={stack}
                                onChange={(e) => setStack(e.target.value)}
                                max={99999}
                                placeholder="Menge"
                            />
                            <UnitSelect
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <CategorySelect
                            label="Kategorie"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            savedItems={savedItems}
                            optional
                        />
                        <Textbox
                            autoFocus={itemNameProp}
                            type="text"
                            placeholder="Neue Kategorie"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            maxLength={24}
                        />
                    </div>
                    <Textbox
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        label="Preis"
                        step=".01"
                        optional
                        min={0}
                        max="99999"
                    />
                </div>
                <div className="text-right">
                    <Button
                        disabled={
                            !itemName ||
                            savedItems.find(
                                (v) =>
                                    v.name.toLowerCase() ===
                                    itemName.toLowerCase()
                            )
                        }
                        type="submit"
                    >
                        Hinzufügen
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
