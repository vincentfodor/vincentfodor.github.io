import { useEffect, useState } from "react";
import { Dialog } from "../Dialog";
import { Textbox } from "../Textbox";
import { Button } from "../Button";
import { CategorySelect } from "../selects/CategorySelect";
import { UnitSelect } from "../selects/UnitSelect";
import { ItemPicker } from "../ItemPicker";

export const AddRecipeDialog = ({
    recipeName: recipeNameProp,
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

    const handleSubmit = (e) => {
        e.preventDefault();

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
                (v) => v.name.toLowerCase() === recipeName.toLowerCase()
            )
        ) {
            return false;
        }

        return true;
    };

    return (
        <Dialog
            title="Rezept hinzufügen"
            onClose={handleClose}
            buttons={
                <Button
                    disabled={
                        !recipeName ||
                        recipes.find(
                            (v) =>
                                v.name.toLowerCase() ===
                                recipeName.toLowerCase()
                        )
                    }
                    onClick={handleSubmit}
                >
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
                                v.name.toLowerCase() ===
                                recipeName.toLowerCase()
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
                    <ItemPicker disableTimesAdded />
                </div>
            </div>
        </Dialog>
    );
};
