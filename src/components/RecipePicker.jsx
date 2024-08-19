import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Select } from "./Select";
import classNames from "classnames";
import { AddItemDialog } from "./dialogs/AddItemDialog";
import { UpdateItemDialog } from "./dialogs/UpdateItemDialog";
import { AddRecipeDialog } from "./dialogs/AddRecipeDialog";
import { UpdateRecipeDialog } from "./dialogs/UpdateRecipeDialog";

export const RecipePicker = ({
    storageName = "main-recipes",
    items = [],
    onItemEdit = () => {},
    onItemDelete = () => {},
    onPick = () => {},
}) => {
    const [recipes, setRecipes] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [isAddRecipeDialogOpen, setIsAddRecipeDialogOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [sort, setSort] = useState(
        localStorage.getItem(`${storageName}-sort`) || "timesAdded-desc"
    );
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        const recipeList = localStorage.getItem(storageName);

        if (recipeList) {
            try {
                const parsedSavedList = JSON.parse(recipeList);

                setRecipes(parsedSavedList);
            } catch (e) {
                console.error(e);
                alert("Fuck");
            }
        }
    }, []);

    const save = (name, data) => {
        localStorage.setItem(name, JSON.stringify(data));
    };

    let filteredRecipeList = (recipes || []).filter((recipe) =>
        recipe.name.toLowerCase().includes(recipeName.toLowerCase())
    );

    const renderRecipes = (filteredRecipeList || [])
        .sort((a, b) => sortSavedItems(a, b, sort))
        .map((recipe) => {
            return (
                <div
                    key={`saved-item-${recipe.id}`}
                    className="flex flex-row items-center active:scale-105 cursor-pointer transition border-b"
                    onClick={() => addRecipe(recipe.name)}
                    onContextMenu={(e) => {
                        e.preventDefault();

                        setCurrentItem(recipe);
                    }}
                >
                    <div className="grow" />
                    <div className="flex flex-col py-2 font-semibold pr-2">
                        {recipe.name}
                    </div>
                </div>
            );
        });

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        addRecipe(recipeName);
    };

    const addRecipe = (name) => {
        if (!name) {
            setIsAddRecipeDialogOpen(true);

            return;
        }

        const existingRecipe = recipes.find(
            (v) => v.name.toLowerCase() === name.toLowerCase()
        );

        if (existingRecipe) {
            // Item already exists in saved items

            let newRecipes = recipes.map((v) => {
                if (v.id === existingRecipe.id) {
                    return {
                        ...v,
                        timesAdded: existingRecipe.timesAdded + 1,
                    };
                }

                return v;
            });

            setRecipes(newRecipes);

            save(storageName, newRecipes);

            onPick(existingRecipe);
        } else {
            // New Item

            setIsAddRecipeDialogOpen(true);
        }
    };

    const handleEditRecipe = (item) => {
        let newRecipes = recipes.map((v) => {
            if (v.id === item.id) {
                return item;
            }

            return v;
        });

        setRecipes(newRecipes);

        save(storageName, newRecipes);

        onItemEdit(item);
    };

    const handleRecipeCreate = (newRecipe) => {
        const newSavedId =
            recipes.length > 0 ? Math.max(...recipes.map((o) => o.id)) + 1 : 0;

        const newRecipes = [
            ...recipes,
            {
                ...newRecipe,
                id: newSavedId,
                timesAdded: 1,
            },
        ];

        setRecipes(newRecipes);

        save(storageName, newRecipes);

        setRecipeName("");
    };

    const handleRecipeDelete = (item) => {
        const confirmation = window.confirm(
            `wilsch ${item.name} wirklich löschen?`
        );

        if (!confirmation) {
            return;
        }

        setCurrentItem(null);

        const newRecipes = recipes.filter((v) => v.id !== item.id);

        setRecipes(newRecipes);
        save(storageName, newRecipes);
    };

    const categories = [
        ...new Set(
            recipes
                .filter((recipe) => recipe.category)
                .map((recipe) => recipe.category)
        ),
    ];

    return (
        <>
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center mb-2"
                >
                    <Textbox
                        type="text"
                        className="grow mr-2"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Rezepte suchen oder hinzufügen..."
                    />
                    <Button
                        type="submit"
                        className="bg-gray-100 !text-black w-10 h-10 p-0 rounded-full active:scale-110 transition inline-flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} size="sm" />
                    </Button>
                </form>
                <div className="text-right mb-1">
                    <Select
                        value={sort}
                        onChange={(e) => {
                            let value = e.target.value;

                            setSort(value);
                            localStorage.setItem(`${storageName}-sort`, value);
                        }}
                    >
                        <option value="timesAdded-asc">Meistgekauft</option>
                        <option value="name-desc">Bezeichnung</option>
                    </Select>
                </div>
                {!!categories && categories.length > 0 && (
                    <div className="grow whitespace-nowrap overflow-y-auto mb-2 pb-2">
                        {(categories || []).map((category) => (
                            <Button
                                onClick={() =>
                                    categoryFilter === category
                                        ? setCategoryFilter(null)
                                        : setCategoryFilter(category)
                                }
                                className={classNames(
                                    "mr-2 last:mr-0 transition",
                                    {
                                        "bg-gray-100 !text-black":
                                            categoryFilter !== category,
                                    }
                                )}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-1 gap-2 mb-4">
                    {renderRecipes}
                </div>
            </div>
            <AddRecipeDialog
                open={isAddRecipeDialogOpen}
                onClose={() => setIsAddRecipeDialogOpen(false)}
                recipeName={recipeName}
                recipes={recipes}
                onSubmit={handleRecipeCreate}
            />
            <UpdateRecipeDialog
                recipe={currentItem}
                onSubmit={(newItem) => {
                    handleEditRecipe(newItem);
                }}
                open={currentItem}
                onClose={() => setCurrentItem(null)}
                recipes={recipes}
                onDelete={handleRecipeDelete}
            />
        </>
    );
};

const sortSavedItems = (a, b, sort) => {
    let [field, direction] = sort.split("-");

    let fieldA = a[field];
    let fieldB = b[field];

    if (typeof fieldA === "string") {
        fieldA = fieldA.toLowerCase();
    }

    if (typeof fieldB === "string") {
        fieldB = fieldB.toLowerCase();
    }

    if (a[field] < b[field]) {
        return direction === "asc" ? 1 : -1;
    }
    if (a[field] > b[field]) {
        return direction === "asc" ? -1 : 1;
    }
    return 0;
};
