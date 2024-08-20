import { useEffect, useState } from "react";
import { Dialog } from "../Dialog";
import { Textbox } from "../Textbox";
import { Button } from "../Button";
import { CategorySelect } from "../selects/CategorySelect";
import { ItemPicker } from "../ItemPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const AddRecipeDialog = ({
    recipeName: recipeNameProp = "",
    category: categoryProp,
    onSubmit,
    onClose,
    recipes,
    ...props
}) => {
    const [recipeName, setRecipeName] = useState(recipeNameProp);
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]);

    useEffect(() => {
        setRecipeName(recipeNameProp);
    }, [recipeNameProp]);

    useEffect(() => {
        setCategory(categoryProp);
    }, [categoryProp]);

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        if (onSubmit) {
            onSubmit({
                name: recipeName,
                category,
                items,
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
        setRecipeName(recipeNameProp);
        setCategory(categoryProp);
        setItems([]);
    };

    const validate = () => {
        if (
            !recipeName ||
            !items?.length ||
            recipes.find(
                (v) => v.name?.toLowerCase() === recipeName?.toLowerCase()
            )
        ) {
            return false;
        }

        return true;
    };

    const handleItemPick = (item) => {
        setItems([...items, { ...item, savedId: item.id }]);
    };

    const handleItemRemove = (item) => {
        setItems(items.filter((v) => v.id !== item.id));
    };

    const renderItems = (items || []).map((item) => (
        <div
            className="px-2 py-1 bg-neutral-100 rounded-md inline-block cursor-pointer mr-2 mb-2"
            onClick={() => handleItemRemove(item)}
        >
            <span className="mr-2">{item.name}</span>
            <FontAwesomeIcon icon={faClose} size="sm" />
        </div>
    ));

    return (
        <Dialog
            title="Rezept hinzufügen"
            onClose={handleClose}
            buttons={
                <Button disabled={!validate()} onClick={handleSubmit}>
                    Hinzufügen
                </Button>
            }
            {...props}
        >
            <div className="space-y-2 mb-4">
                <Textbox
                    autoFocus={!recipeNameProp}
                    type="text"
                    label="Bezeichnung"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    maxLength={24}
                    error={
                        recipes.find(
                            (v) =>
                                v.name?.toLowerCase() ===
                                recipeName?.toLowerCase()
                        ) &&
                        "Ein Rezept mit dieser Bezeichnung exisitiert bereits."
                    }
                />
                <div>
                    <CategorySelect
                        label="Kategorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        savedItems={recipes}
                        optional
                    />
                    <Textbox
                        autoFocus={recipeNameProp}
                        type="text"
                        placeholder="Neue Kategorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        maxLength={24}
                    />
                </div>
                <div>
                    <label className="mb-1 block">Produkte</label>
                    {items.length > 0 && <div>{renderItems}</div>}
                    <ItemPicker
                        disableTimesAdded
                        onPick={handleItemPick}
                        items={items}
                    />
                </div>
            </div>
        </Dialog>
    );
};
