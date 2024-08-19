import { useEffect, useState } from "react";
import { Dialog } from "../Dialog";
import { Textbox } from "../Textbox";
import { Button } from "../Button";
import { CategorySelect } from "../selects/CategorySelect";
import { ItemPicker } from "../ItemPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export const UpdateRecipeDialog = ({
    recipe,
    onSubmit,
    onClose,
    onDelete,
    recipes,
    ...props
}) => {
    const [recipeName, setRecipeName] = useState(recipe?.name || "");
    const [category, setCategory] = useState(recipe?.category || "");
    const [items, setItems] = useState(recipe?.items || []);

    useEffect(() => {
        init();
    }, [recipe]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        if (onSubmit) {
            onSubmit({
                ...recipe,
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
        setRecipeName(recipe?.name || "");
        setCategory(recipe?.category || "");
        setItems(recipe?.items || []);
    };

    const validate = () => {
        if (
            !recipeName ||
            !items?.length ||
            recipes.find(
                (v) =>
                    recipeName !== recipe.name &&
                    v.name?.toLowerCase() === recipeName?.toLowerCase()
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

    if (!recipe) {
        return null;
    }

    return (
        <Dialog
            title="Rezept bearbeiten"
            onClose={handleClose}
            buttons={[
                <Button
                    className="!bg-red-500 !text-white mr-2"
                    onClick={() => onDelete(recipe)}
                >
                    Löschen
                </Button>,
                <Button disabled={!validate()} onClick={handleSubmit}>
                    Speichern
                </Button>,
            ]}
            {...props}
        >
            <div className="space-y-2 mb-4">
                <Textbox
                    type="text"
                    label="Bezeichnung"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    maxLength={24}
                    error={
                        recipes.find(
                            (v) =>
                                recipeName !== recipe?.name &&
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
