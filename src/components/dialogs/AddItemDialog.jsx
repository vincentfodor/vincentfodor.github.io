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
    const [unit, setUnit] = useState(categoryProp || "Stück");
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

        if (onSubmit) {
            onSubmit({
                name: itemName,
                unit,
                stack,
                category,
                price,
            });
        }

        if (onClose) {
            onClose();
        }
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
        setUnit("Stück");
    };

    return (
        <Dialog title="Produkt hinzufügen" onClose={handleClose} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2 mb-4">
                    <Textbox
                        autoFocus={!itemNameProp}
                        type="text"
                        label="was isch des?"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <Textbox
                        type="number"
                        value={stack}
                        onChange={(e) => setStack(e.target.value)}
                        label="wie viele sind im päckle?"
                    />
                    <UnitSelect
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        label="Mengeneinheit"
                        className="w-full"
                    />
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
                        />
                    </div>
                    <Textbox
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        label="Preis"
                        step=".01"
                        optional
                    />
                </div>
                <div className="text-right">
                    <Button
                        disabled={
                            !itemName ||
                            savedItems.find((v) => v.name === itemName)
                        }
                    >
                        Hinzufügen
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
