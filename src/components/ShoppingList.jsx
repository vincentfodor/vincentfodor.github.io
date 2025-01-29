import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { motivationalQuotes } from "../data/motivationalQuotes";
import Marquee from "react-fast-marquee";
import { faAppleAlt, faBowlRice } from "@fortawesome/free-solid-svg-icons";
import { UpdateItemDialog } from "./dialogs/UpdateItemDialog";
import { ItemPicker } from "./ItemPicker";
import { ViewButton } from "./buttons/ViewButton";
import { RecipePicker } from "./RecipePicker";
import Siquijor from "./animations/Siquijor";

export const ShoppingList = ({
    className,
    storageName,
    itemStorageName,
    isMuted,
    ...props
}) => {
    const itemsWrapperRef = useRef();

    const [items, setItems] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [motivation, setMotivation] = useState("");
    const [currentItem, setCurrentItem] = useState(null);
    const [view, setView] = useState("products");
    const [explode, setExplode] = useState(false);
    const [isAnimationRunning, setIsAnimationRunning] = useState(false);
    const [voices, setVoices] = useState([]);

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

    useEffect(() => {
        if (voices.length > 0) {
            return;
        }

        let voiceFetchInterval = setInterval(() => {
            const fetchVoices = async () => {
                let synthesis = window.speechSynthesis;

                setVoices(synthesis.getVoices());
            };

            fetchVoices();
        }, 500);

        return () => clearInterval(voiceFetchInterval);
    }, [voices]);

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

        setItems(newItems);
        save(itemStorageName, newItems);
    };

    const handleItemAdd = (item) => {
        setItems((prevItems) => {
            const newId =
                prevItems.length > 0
                    ? Math.max(...prevItems.map((o) => o.id)) + 1
                    : 0;
            const existingItem = prevItems.find(
                (v) =>
                    v.name.toLowerCase() === item.name.toLowerCase() &&
                    v.action !== "deleted"
            );

            if (existingItem) {
                return prevItems;
            }

            const newItems = existingItem
                ? prevItems.map((v) =>
                      v.id === existingItem.id
                          ? {
                                ...v,
                                quantity:
                                    Number(v.quantity) + Number(item.stack),
                            }
                          : v
                  )
                : [
                      ...prevItems,
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

            save(itemStorageName, newItems);
            return newItems;
        });
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

    const handleRecipeAdd = (recipe) => {
        (recipe.items || []).forEach(handleItemAdd);
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

    console.log({ voices });

    const handleFinish = async () => {
        if (!itemsWrapperRef.current) {
            return;
        }

        let motivation =
            motivationalQuotes[
                Math.floor(Math.random() * motivationalQuotes.length)
            ];

        setMotivation(motivation);

        if (!isMuted) {
            if ("speechSynthesis" in window) {
                let synthesis = window.speechSynthesis;

                let voice = (voices || []).find(function (voice) {
                    return voice.voiceURI === "Google Deutsch";
                });

                if (!voice) {
                    voice = voices.find(function (voice) {
                        return (
                            voice.voiceURI ===
                            "Microsoft Stefan - German (Germany)"
                        );
                    });
                }

                if (!voice) {
                    voice = voices.find(function (voice) {
                        return voice.lang === "de-DE";
                    });
                }

                if (!voice) {
                    voice = voices[0];
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

        setIsAnimationRunning(true);

        itemsWrapperRef.current.style.transition =
            "all 1000ms cubic-bezier(.3,-0.45,.05,1)";
        itemsWrapperRef.current.style.transform = "scale(0) rotate(420deg)";
        itemsWrapperRef.current.style.opacity = "0";

        setTimeout(() => {
            setExplode(true);

            itemsWrapperRef.current.style.transform = "scale(0) rotate(0)";

            setTimeout(() => {
                setItems(items.filter((v) => v.action !== "deleted"));

                itemsWrapperRef.current.style.transform = "scale(1) rotate(0)";
                itemsWrapperRef.current.style.opacity = "1";

                setExplode(false);
                setIsAnimationRunning(false);
            }, 2000);
        }, 1100);

        setTimeout(() => {}, 1200);
    };

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
                <div className="relative overflow-hidden">
                    <div ref={itemsWrapperRef}>
                        {items.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 transition-all">
                                {renderItemGroups}
                            </div>
                        )}
                    </div>
                    {explode && (
                        <div className="absolute w-full h-full flex items-center justify-center top-0 left-0 pointer-events-none">
                            <div className="relative">
                                <Siquijor size="300" color="black" />
                                {/* <div className="absolute -left-4 -top-2">
                                    <Bohol
                                        size="50"
                                        color="black"
                                        delay={1.23}
                                    />
                                </div>
                                <div className="absolute -left-4 -bottom-2">
                                    <Boracay
                                        size="50"
                                        color="black"
                                        delay={1.27}
                                    />
                                </div>
                                <div className="absolute -right-5 -top-2">
                                    <Bohol
                                        size="70"
                                        color="black"
                                        delay={1.25}
                                    />
                                </div>
                                <div className="absolute -right-5 -bottom-2">
                                    <Bohol
                                        size="50"
                                        color="black"
                                        delay={1.2}
                                    />
                                </div> */}
                            </div>
                        </div>
                    )}
                </div>
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
            {items.find((v) => v.action === "deleted") &&
                !isAnimationRunning && (
                    <div className="fixed bottom-0 left-0 p-4 w-full">
                        <Button
                            className="w-full justify-center p-4 font-bold"
                            onClick={handleFinish}
                        >
                            Fertig!
                        </Button>
                    </div>
                )}
            <div className="grid grid-cols-2 gap-1 rounded-lg mb-2">
                <ViewButton
                    active={view === "products"}
                    onClick={() => setView("products")}
                    icon={faAppleAlt}
                >
                    Produkte
                </ViewButton>
                <ViewButton
                    active={view === "recipes"}
                    onClick={() => setView("recipes")}
                    icon={faBowlRice}
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
            {view === "recipes" && (
                <RecipePicker items={items} onPick={handleRecipeAdd} />
            )}
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
