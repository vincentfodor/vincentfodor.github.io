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

export const ShoppingList = ({
    className,
    storageName,
    itemStorageName,
    ...props
}) => {
    const [items, setItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [motivation, setMotivation] = useState("");
    const [sort, setSort] = useState(
        localStorage.getItem(`${itemStorageName}-sort`) || "timesAdded-desc"
    );

    useEffect(() => {
        const itemList = localStorage.getItem(itemStorageName);
        const savedList = localStorage.getItem(storageName);

        if (itemList) {
            try {
                const parsedItemList = JSON.parse(itemList);

                setItems(
                    parsedItemList.filter(
                        (v) => v.action !== "deleted" && v.price
                    )
                );
            } catch (e) {
                console.error(e);
                alert("Shit");
            }
        }

        if (savedList) {
            try {
                const parsedSavedList = JSON.parse(savedList);

                setSavedItems(parsedSavedList.filter((v) => v.price));
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
                utterance.pitch = 0.3;
                utterance.rate = 0.7;
                utterance.volume = 1;

                synthesis.speak(utterance);
            } else {
                console.error("Text-to-speech not supported.");
            }
        }

        setItems(newItems);
        save(itemStorageName, newItems);
    };

    const handleItemAdd = (name, e) => {
        if (e) {
            e.preventDefault();
        }

        if (!name) {
            return;
        }

        setItemName("");

        const newId =
            items.length > 0 ? Math.max(...items.map((o) => o.id)) + 1 : 0;

        const savedItem = savedItems.find(
            (v) => v.name.toLowerCase() === name.toLowerCase()
        );

        if (savedItem) {
            // Item already exists in saved items

            let newItems;

            const existingItem = items.find(
                (v) =>
                    v.name.toLowerCase() === name.toLowerCase() &&
                    v.action !== "deleted"
            );

            if (existingItem) {
                newItems = items.map((v) => {
                    if (v.id === existingItem.id) {
                        return {
                            ...v,
                            quantity:
                                Number(v.quantity) + Number(savedItem.stack),
                        };
                    }

                    return v;
                });
            } else {
                newItems = [
                    ...items,
                    {
                        id: newId,
                        savedId: savedItem.id,
                        name,
                        stack: savedItem.stack,
                        unit: savedItem.unit,
                        quantity: savedItem.stack,
                        price: savedItem.price,
                    },
                ];
            }

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
            setItems(newItems);

            save(itemStorageName, newItems);
            save(storageName, newSavedItems);
        } else {
            // New Item

            const unit = prompt(
                "des kenn i ja no gar ned heide bimbam. was für ne messung isch des?",
                "Stück"
            );

            if (!unit) {
                return;
            }

            const stack = promptInt("wie viele sins denn im päckle?", 1);

            if (!stack) {
                return;
            }

            const price = promptInt("und was koscht der spaß?", 1);

            if (!price) {
                return;
            }

            const newSavedId =
                savedItems.length > 0
                    ? Math.max(...savedItems.map((o) => o.id)) + 1
                    : 0;

            const newSavedItems = [
                ...savedItems,
                {
                    id: newSavedId,
                    name,
                    stack,
                    unit,
                    timesAdded: 1,
                    price,
                },
            ];

            setSavedItems(newSavedItems);

            save(storageName, newSavedItems);

            const newItems = [
                ...items,
                {
                    id: newId,
                    name,
                    stack,
                    unit,
                    quantity: stack,
                    price,
                },
            ];

            setItems(newItems);

            save(itemStorageName, newItems);
        }
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

        const newSavedItems = savedItems.filter((v) => v.id !== item.id);

        setSavedItems(newSavedItems);
        save(storageName, newSavedItems);
    };

    const handleEditSavedItem = (item, e) => {
        if (e) {
            e.stopPropagation();
        }

        const unit = prompt("was für ne messung isch des?", item.unit);

        if (!unit) {
            return;
        }

        const stack = promptInt("wie viele sins denn im päckle?", item.stack);

        if (!stack) {
            return;
        }

        const price = promptInt("und was koscht der spaß?", item.price);

        if (!price) {
            return;
        }

        let newSavedItems = savedItems.map((v) => {
            if (v.id === item.id) {
                return {
                    ...v,
                    unit,
                    stack,
                    price,
                };
            }

            return v;
        });

        setSavedItems(newSavedItems);
        save(storageName, newSavedItems);
    };

    const save = (name, data) => {
        localStorage.setItem(name, JSON.stringify(data));
    };

    const filteredSavedItems = (savedItems || [])
        .filter((item) =>
            item.name.toLowerCase().includes(itemName.toLowerCase())
        )
        .sort((a, b) => sortSavedItems(a, b, sort));

    const renderItems = (items || []).map((item) => (
        <div
            key={`item-${item.id}`}
            className="flex flex-row items-center active:scale-105 transition border-b border-gray-200 pl-2"
            onClick={() => handleItemCheck(item)}
        >
            <div
                className={classNames(
                    "flex grow flex-col py-2 font-semibold mr-2",
                    {
                        "line-through": item.action === "deleted",
                    }
                )}
            >
                {item.name}
            </div>
            <div
                className={classNames("py-2 pr-4 shrink-0", {
                    "line-through": item.action === "deleted",
                })}
            >{`${item.quantity} ${item.unit}`}</div>
            <div
                className={classNames("flex flex-col py-2 font-semibold mr-2", {
                    "line-through": item.action === "deleted",
                })}
            >
                {formatCurrency(item.price * (item.quantity / item.stack), "€")}
            </div>
        </div>
    ));

    const renderSavedItems = (filteredSavedItems || []).map((item) => (
        <div
            key={`saved-item-${item.id}`}
            className="flex flex-row items-center active:scale-105 transition border-b"
            onClick={() => handleItemAdd(item.name)}
        >
            <div className="grow">
                <Button
                    onClick={(e) => handleDeleteSavedItem(item, e)}
                    className="bg-transparent !text-black w-8 h-8 rounded-full active:scale-110 transition"
                >
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        size="sm"
                        className="text-red-500"
                    />
                </Button>
                <Button
                    onClick={(e) => handleEditSavedItem(item, e)}
                    className="bg-transparent !text-black w-10 h-10 rounded-full active:scale-110 transition"
                >
                    <FontAwesomeIcon
                        icon={faPenAlt}
                        size="sm"
                        className="text-slate-600"
                    />
                </Button>
            </div>
            <div className="flex flex-col py-2 font-semibold pr-4">
                {item.name}
            </div>
        </div>
    ));

    const total = (items?.filter((v) => v.action === "deleted") || []).reduce(
        (prev, current) =>
            prev + current.price * (current.quantity / current.stack),
        0
    );

    return (
        <div className={classNames(className, "p-4")}>
            {motivation && (
                <Marquee className="text-sm mb-2 mr-2" speed={20}>
                    {motivation}
                </Marquee>
            )}
            {items.length > 0 && (
                <div className="grid grid-cols-1 mb-4">{renderItems}</div>
            )}
            {total > 0 && (
                <div className="text-right mb-4 px-2">
                    <span className="font-bold">
                        Zu bezahlen: {formatCurrency(total, "€")}
                    </span>
                </div>
            )}
            <form
                onSubmit={(e) => handleItemAdd(itemName, e)}
                className="flex items-center mb-2"
            >
                <Textbox
                    type="text"
                    className="grow mr-2"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Suchen oder hinzufügen..."
                />
                <Button
                    type="submit"
                    className="bg-gray-200 !text-black w-10 h-10 p-0 rounded-full active:scale-110 transition inline-flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                </Button>
            </form>
            <div className="text-right mb-4">
                <Select
                    value={sort}
                    onChange={(e) => {
                        let value = e.target.value;

                        setSort(value);
                        localStorage.setItem(`${itemStorageName}-sort`, value);
                    }}
                >
                    <option value="timesAdded-asc">Meistgekauft</option>
                    <option value="name-desc">Bezeichnung</option>
                </Select>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-4">
                {renderSavedItems}
            </div>
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

const sortSavedItems = (a, b, sort) => {
    let [field, direction] = sort.split("-");

    if (a[field] < b[field]) {
        return direction === "asc" ? 1 : -1;
    }
    if (a[field] > b[field]) {
        return direction === "asc" ? -1 : 1;
    }
    return 0;
};

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
