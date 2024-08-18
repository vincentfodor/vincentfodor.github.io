import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";
import { motivationalQuotes } from "../data/motivationalQuotes";
import Marquee from "react-fast-marquee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenAlt,
    faPlus,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Select } from "./Select";
import { AddItemDialog } from "./dialogs/AddItemDialog";
import { UpdateItemDialog } from "./dialogs/UpdateItemDialog";
import { ProgressBar } from "./ProgressBar";
import { ItemPicker } from "./ItemPicker";
import { ViewButton } from "./buttons/ViewButton";
import { RecipePicker } from "./RecipePicker";

export const ShoppingList = ({
    className,
    storageName,
    itemStorageName,
    isMuted,
    ...props
}) => {
    const [items, setItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [motivation, setMotivation] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [view, setView] = useState("products");

    useEffect(() => {
        const itemList = localStorage.getItem(itemStorageName);
        const savedList = localStorage.getItem(storageName);

        if (itemList) {
            try {
                const parsedItemList = JSON.parse(itemList);

                setItems(parsedItemList.filter((v) => v.action !== "deleted"));
            } catch (e) {
                console.error(e);
                alert("Shit");
            }
        }

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

    const handleItemCheck = (item) => {
        const newItems = items.map((v) => {
            if (v.id === item.id) {
                return {
                    ...v,
                    action: item.action === "deleted" ? null : "deleted",
                };
            }

            return v;
        });

        if (item.action !== "deleted") {
            let motivation =
                motivationalQuotes[
                    Math.floor(Math.random() * motivationalQuotes.length)
                ];

            setMotivation(motivation);

            if (!isMuted) {
                if ("speechSynthesis" in window) {
                    let synthesis = window.speechSynthesis;

                    let voice = synthesis.getVoices().find(function (voice) {
                        return voice.voiceURI === "Google Deutsch";
                    });

                    if (!voice) {
                        voice = synthesis.getVoices().find(function (voice) {
                            return (
                                voice.voiceURI ===
                                "Microsoft Stefan - German (Germany)"
                            );
                        });
                    }

                    if (!voice) {
                        voice = synthesis.getVoices().find(function (voice) {
                            return voice.lang === "de-DE";
                        });
                    }

                    let utterance = new SpeechSynthesisUtterance(motivation);

                    utterance.voice = voice;
                    utterance.pitch = 0.2;
                    utterance.rate = 0.9;
                    utterance.volume = 1;

                    synthesis.speak(utterance);
                } else {
                    console.error("Text-to-speech not supported.");
                }
            }
        }

        setItems(newItems);
        save(itemStorageName, newItems);
    };

    const handleItemAdd = (item) => {
        const newId =
            items.length > 0 ? Math.max(...items.map((o) => o.id)) + 1 : 0;

        let newItems;

        const existingItem = items.find(
            (v) =>
                v.name.toLowerCase() === item.name.toLowerCase() &&
                v.action !== "deleted"
        );

        if (existingItem) {
            newItems = items.map((v) => {
                if (v.id === existingItem.id) {
                    return {
                        ...v,
                        quantity: Number(v.quantity) + Number(item.stack),
                    };
                }

                return v;
            });
        } else {
            newItems = [
                ...items,
                {
                    id: newId,
                    savedId: item.id,
                    name: item.name,
                    stack: item.stack,
                    unit: item.unit,
                    quantity: item.stack,
                    price: item.price,
                    category: item.category,
                },
            ];
        }

        setItems(newItems);

        save(itemStorageName, newItems);
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

    const handleEditSavedItem = (item) => {
        let newSavedItems = savedItems.map((v) => {
            if (v.id === item.id) {
                return item;
            }

            return v;
        });

        let newItems = (items || []).map((v) => {
            if (v.savedId === item.id) {
                return {
                    ...v,
                    ...item,
                };
            }

            return v;
        });

        setSavedItems(newSavedItems);
        setItems(newItems);

        save(storageName, newSavedItems);
        save(itemStorageName, newItems);
    };

    const save = (name, data) => {
        localStorage.setItem(name, JSON.stringify(data));
    };

    const itemGroups = {};

    items.forEach((item) => {
        if (item.category) {
            if (itemGroups[item.category]) {
                itemGroups[item.category].push(item);
            } else {
                itemGroups[item.category] = [item];
            }
        } else {
            if (itemGroups["Meine Produkte"]) {
                itemGroups["Meine Produkte"].push(item);
            } else {
                itemGroups["Meine Produkte"] = [item];
            }
        }
    });

    const handleItemContextMenu = (e, item) => {
        e.preventDefault();

        const savedItem = savedItems.find((v) => v.id === item.savedId);

        setCurrentItem(savedItem);
    };

    const renderItems = (list) =>
        (list || []).map((item) => (
            <div
                key={`item-${item.id}`}
                className="flex flex-row items-center active:scale-105 cursor-pointer transition border-b border-gray-200 pl-2"
                onClick={() => handleItemCheck(item)}
                onContextMenu={(e) => handleItemContextMenu(e, item)}
            >
                <div
                    className={classNames(
                        "flex grow flex-col py-2 font-normal mr-2",
                        {
                            "line-through": item.action === "deleted",
                        }
                    )}
                >
                    {item.name}
                </div>
                <div
                    className={classNames("py-2 shrink-0 pr-2", {
                        "line-through": item.action === "deleted",
                    })}
                >{`${item.quantity} ${item.unit}`}</div>
                {Number(item.price) !== "NaN" && Number(item.price) > 0 && (
                    <div
                        className={classNames(
                            "flex flex-col py-2 font-semibold mr-2",
                            {
                                "line-through": item.action === "deleted",
                            }
                        )}
                    >
                        {formatCurrency(
                            item.price * (item.quantity / item.stack),
                            "€"
                        )}
                    </div>
                )}
            </div>
        ));

    const renderItemGroups = Object.keys(itemGroups)
        .sort()
        .map((key) => {
            let group = itemGroups[key];

            return (
                <div>
                    <h3 className="font-bold mb-1">{key}</h3>
                    {renderItems(group)}
                </div>
            );
        });

    const totalCost = (
        items?.filter((v) => v.action === "deleted" && v.price) || []
    ).reduce(
        (prev, current) =>
            prev + current.price * (current.quantity / current.stack),
        0
    );

    const total = (items?.filter((v) => v.price) || []).reduce(
        (prev, current) =>
            prev + current.price * (current.quantity / current.stack),
        0
    );

    return (
        <div className={classNames(className, "p-4")}>
            <div
                className={classNames({
                    "mb-4":
                        motivation ||
                        items.length > 0 ||
                        total > 0 ||
                        totalCost > 0,
                })}
            >
                {motivation && (
                    <Marquee className="text-sm mb-2 mr-2" speed={20}>
                        {motivation}
                    </Marquee>
                )}
                {items.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        {renderItemGroups}
                    </div>
                )}
                {total > 0 && (
                    <div className="text-right p-2 border-b">
                        <span className="font-bold">
                            Gesamt: {formatCurrency(total, "€")}
                        </span>
                    </div>
                )}
                {totalCost > 0 && (
                    <div className="text-right p-2 border-b">
                        <span className="font-bold">
                            Zu bezahlen:{" "}
                            <span className="underline-offset-2 underline">
                                {formatCurrency(totalCost, "€")}
                            </span>
                        </span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-neutral-100 mb-2">
                <ViewButton
                    active={view === "products"}
                    onClick={() => setView("products")}
                >
                    Produkte
                </ViewButton>
                <ViewButton
                    active={view === "recipes"}
                    onClick={() => setView("recipes")}
                >
                    Rezepte
                </ViewButton>
            </div>
            {view === "products" && (
                <ItemPicker
                    onPick={handleItemAdd}
                    onItemEdit={handleEditSavedItem}
                    items={items}
                />
            )}
            {view === "recipes" && <RecipePicker items={items} />}
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
        </div>
    );
};

// const sortItems = (a, b) => {
//   if (a.action === "deleted") {
//     return 1;
//   }
//   if (b.action === "deleted") {
//     return -1;
//   }
//   return 0;
// };

export const promptInt = (question, defaultValue) => {
    let result = prompt(question, defaultValue);

    if (result === null) {
        // Cancelled
        return null;
    }

    if (!result) {
        return promptInt(
            `${result} isch aber keine nummer wo ich kenn, nimm ne normale zahl`
        );
    }

    result = result.replace(",", ".");

    if (Number(result) === "NaN") {
        return promptInt(
            `${result} isch aber keine nummer wo ich kenn, nimm ne normale zahl`
        );
    }

    return Number(result);
};

const formatCurrency = (number, symbol = "$") => {
    const formattedNumber = Number(number).toFixed(2).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    });

    // Format the number as a currency string
    return `${formattedNumber} ${symbol}`;
};
