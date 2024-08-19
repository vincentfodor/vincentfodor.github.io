import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Select } from "./Select";
import classNames from "classnames";
import { AddItemDialog } from "./dialogs/AddItemDialog";
import { UpdateItemDialog } from "./dialogs/UpdateItemDialog";

export const ItemPicker = ({
    itemStorageName = "main-items",
    storageName = "main",
    items = [],
    onItemEdit = () => {},
    onItemDelete = () => {},
    onPick = () => {},
    disableTimesAdded,
}) => {
    const [savedItems, setSavedItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [sort, setSort] = useState(
        localStorage.getItem(`${itemStorageName}-sort`) || "timesAdded-desc"
    );
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        const savedList = localStorage.getItem(storageName);

        if (savedList) {
            try {
                const parsedSavedList = JSON.parse(savedList);

                setSavedItems(parsedSavedList);
            } catch (e) {
                console.error(e);
                alert("Fuck");
            }
        }
    }, []);

    const save = (name, data) => {
        localStorage.setItem(name, JSON.stringify(data));
    };

    let filteredSavedItems = (savedItems || []).filter((item) =>
        item.name.toLowerCase().includes(itemName.toLowerCase())
    );

    if (categoryFilter) {
        filteredSavedItems = (filteredSavedItems || []).filter(
            (item) => item.category === categoryFilter
        );
    }

    const renderSavedItems = (filteredSavedItems || [])
        .sort((a, b) => sortSavedItems(a, b, sort))
        .map((item) => {
            const existingItem = items.find((v) => v.savedId === item.id);

            if (existingItem) {
                return;
            }

            return (
                <div
                    key={`saved-item-${item.id}`}
                    className="flex flex-row items-center active:scale-105 cursor-pointer transition border-b"
                    onClick={() => addItem(item.name)}
                    onContextMenu={(e) => {
                        e.preventDefault();

                        setCurrentItem(item);
                    }}
                >
                    <div className="grow" />
                    <div className="flex flex-col py-2 font-semibold pr-2">
                        {item.name}
                    </div>
                </div>
            );
        });

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        addItem(itemName);
    };

    const addItem = (name) => {
        if (!name) {
            setIsAddItemDialogOpen(true);

            return;
        }

        const newId =
            items.length > 0 ? Math.max(...items.map((o) => o.id)) + 1 : 0;

        const savedItem = savedItems.find(
            (v) => v.name.toLowerCase() === name.toLowerCase()
        );

        if (savedItem) {
            // Item already exists in saved items

            if (!disableTimesAdded) {
                let newSavedItems = savedItems.map((v) => {
                    if (v.id === savedItem.id) {
                        return {
                            ...v,
                            timesAdded: savedItem.timesAdded + 1,
                        };
                    }

                    return v;
                });

                setSavedItems(newSavedItems);

                save(storageName, newSavedItems);
            }

            onPick(savedItem);
        } else {
            // New Item

            setIsAddItemDialogOpen(true);
        }
    };

    const handleEditSavedItem = (item) => {
        let newSavedItems = savedItems.map((v) => {
            if (v.id === item.id) {
                return item;
            }

            return v;
        });

        const recipeList = localStorage.getItem("main-recipes");

        if (recipeList) {
            try {
                const parsedRecipeList = JSON.parse(recipeList);

                parsedRecipeList.forEach((recipe) => {
                    recipe.items = recipe.items.map((v) => {
                        if (v.id === item.id) {
                            return {
                                ...v,
                                ...item,
                            };
                        }

                        return v;
                    });
                });

                save("main-recipes", parsedRecipeList);
            } catch (e) {
                console.error(e);
                alert("Fuck");
            }
        }

        setSavedItems(newSavedItems);

        save(storageName, newSavedItems);

        onItemEdit(item);
    };

    const handleItemCreate = (newItem) => {
        const newSavedId =
            savedItems.length > 0
                ? Math.max(...savedItems.map((o) => o.id)) + 1
                : 0;

        const newSavedItems = [
            ...savedItems,
            {
                id: newSavedId,
                name: newItem.name,
                stack: newItem.stack,
                unit: newItem.unit,
                timesAdded: 1,
                price: newItem.price,
                category: newItem.category,
            },
        ];

        setSavedItems(newSavedItems);

        save(storageName, newSavedItems);

        setItemName("");
    };

    const handleDeleteSavedItem = (item, e) => {
        if (e) {
            e.stopPropagation();
        }

        const confirmation = window.confirm(
            `wilsch ${item.name} wirklich löschen?`
        );

        if (!confirmation) {
            return;
        }

        setCurrentItem(null);

        const newSavedItems = savedItems.filter((v) => v.id !== item.id);

        setSavedItems(newSavedItems);
        save(storageName, newSavedItems);
    };

    const categories = [
        ...new Set(
            savedItems
                .filter((item) => item.category)
                .map((item) => item.category)
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
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Produkte suchen oder hinzufügen..."
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
                            localStorage.setItem(
                                `${itemStorageName}-sort`,
                                value
                            );
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
                    {renderSavedItems}
                </div>
            </div>
            <AddItemDialog
                open={isAddItemDialogOpen}
                onClose={() => setIsAddItemDialogOpen(false)}
                itemName={itemName}
                savedItems={savedItems}
                onSubmit={handleItemCreate}
                category={categoryFilter}
            />
            <UpdateItemDialog
                item={currentItem}
                onSubmit={(newItem) => {
                    handleEditSavedItem(newItem);
                }}
                open={currentItem}
                onClose={() => setCurrentItem(null)}
                savedItems={savedItems}
                onDelete={(item, e) => handleDeleteSavedItem(item, e)}
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
