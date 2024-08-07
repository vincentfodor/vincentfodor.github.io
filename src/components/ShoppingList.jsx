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

export const ShoppingList = ({
  className,
  storageName,
  itemStorageName,
  isMuted,
  ...props
}) => {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [motivation, setMotivation] = useState("");
  const [sort, setSort] = useState(
    localStorage.getItem(`${itemStorageName}-sort`) || "timesAdded-desc"
  );
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

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
              return voice.voiceURI === "Microsoft Stefan - German (Germany)";
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

  const handleItemAdd = (name, e) => {
    if (e) {
      e.preventDefault();
    }

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

      let newItems;

      const existingItem = items.find(
        (v) =>
          v.name.toLowerCase() === name.toLowerCase() && v.action !== "deleted"
      );

      if (existingItem) {
        newItems = items.map((v) => {
          if (v.id === existingItem.id) {
            return {
              ...v,
              quantity: Number(v.quantity) + Number(savedItem.stack),
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
            category: savedItem.category,
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

      setIsAddItemDialogOpen(true);
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

  const handleItemCreate = (newItem) => {
    const newSavedId =
      savedItems.length > 0 ? Math.max(...savedItems.map((o) => o.id)) + 1 : 0;

    const newId =
      items.length > 0 ? Math.max(...items.map((o) => o.id)) + 1 : 0;

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
          className={classNames("flex grow flex-col py-2 font-normal mr-2", {
            "line-through": item.action === "deleted",
          })}
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
            className={classNames("flex flex-col py-2 font-semibold mr-2", {
              "line-through": item.action === "deleted",
            })}
          >
            {formatCurrency(item.price * (item.quantity / item.stack), "€")}
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
          onClick={() => handleItemAdd(item.name)}
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

  const categories = [
    ...new Set(
      savedItems.filter((item) => item.category).map((item) => item.category)
    ),
  ];

  return (
    <div className={classNames(className, "p-4")}>
      <div
        className={classNames({
          "mb-4": motivation || items.length > 0 || total > 0 || totalCost > 0,
        })}
      >
        {motivation && (
          <Marquee className="text-sm mb-2 mr-2" speed={20}>
            {motivation}
          </Marquee>
        )}
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-4">{renderItemGroups}</div>
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
            localStorage.setItem(`${itemStorageName}-sort`, value);
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
              className={classNames("mr-2 last:mr-0 transition", {
                "bg-gray-100 !text-black": categoryFilter !== category,
              })}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 mb-4">{renderSavedItems}</div>

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
