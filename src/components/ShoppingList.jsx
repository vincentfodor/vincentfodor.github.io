import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";
import { motivationalQuotes } from "../data/motivationalQuotes";
import Marquee from "react-fast-marquee";

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
    let motivation =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    setMotivation(motivation);

    if ("speechSynthesis" in window) {
      var synthesis = window.speechSynthesis;

      var voice = synthesis.getVoices().filter(function (voice) {
        return voice.lang === "de" || voice.lang === "en";
      })[0];

      var utterance = new SpeechSynthesisUtterance(motivation);

      utterance.voice = voice;
      utterance.pitch = 1.5;
      utterance.rate = 1.25;
      utterance.volume = 0.8;

      synthesis.speak(utterance);
    } else {
      console.log("Text-to-speech not supported.");
    }

    const newItems = items.map((v) => {
      if (v.id === item.id) {
        return {
          ...v,
          action: "deleted",
        };
      }

      return v;
    });

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

      const quantity = prompt("so, wie viele wilsch haben?", savedItem.stack);

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
              quantity: Number(v.quantity) + Number(quantity),
            };
          }

          return v;
        });
      } else {
        newItems = [
          ...items,
          {
            id: newId,
            name,
            stack: savedItem.stack,
            unit: savedItem.unit,
            quantity,
          },
        ];
      }

      setItems(newItems);

      save(itemStorageName, newItems);
    } else {
      // New Item

      const stack = prompt(
        "des kenn i ja no gar ned heide bimbam. wie viele sins denn im päckle?",
        100
      );

      if (!stack) {
        return;
      }

      const unit = prompt("und was für ne messung isch des?", "Gramm");

      if (!unit) {
        return;
      }

      const quantity = prompt("so, wie viel wilsch haben?", stack);

      if (!quantity) {
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
          quantity,
        },
      ];

      setItems(newItems);

      save(itemStorageName, newItems);
    }
  };

  const handleDeleteSavedItem = (item) => {
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

  const save = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  };

  const filteredSavedItems = (savedItems || [])
    .filter((item) => item.name.toLowerCase().includes(itemName.toLowerCase()))
    .sort(sortSavedItems);

  const renderItems = (items || []).map((item) => (
    <div className="flex flex-row items-center">
      <div
        className={classNames("flex grow flex-col py-2 font-semibold mr-2", {
          "line-through": item.action === "deleted",
        })}
      >
        {item.name}
      </div>
      <div
        className={classNames("py-2 pr-4 shrink-0", {
          "line-through": item.action === "deleted",
        })}
      >{`${item.quantity} ${item.unit}`}</div>
      <div>
        <Button
          className={
            "bg-green-500 w-9 h-9 p-0 rounded-full active:scale-110 transition shrink-0"
          }
          onClick={() => handleItemCheck(item)}
        >
          ✓
        </Button>
      </div>
    </div>
  ));

  const renderSavedItems = (filteredSavedItems || []).map((item) => (
    <div className="flex flex-row items-center">
      <div className="flex flex-col grow py-2 font-semibold">{item.name}</div>
      <div>
        <Button
          onClick={() => handleDeleteSavedItem(item)}
          className="bg-transparent !text-black w-9 h-9 p-0 rounded-full active:scale-110 transition mr-2"
        >
          🗑
        </Button>
        <Button
          onClick={() => handleItemAdd(item.name)}
          className="bg-gray-300 !text-black w-9 h-9 p-0 rounded-full active:scale-110 transition"
        >
          +
        </Button>
      </div>
    </div>
  ));

  return (
    <div className={classNames(className, "p-4")}>
      {motivation && (
        <Marquee className="text-sm mb-2" speed={20}>
          {motivation}
        </Marquee>
      )}
      <div className="grid grid-cols-1 gap-4 mb-4">{renderItems}</div>
      <form
        onSubmit={(e) => handleItemAdd(itemName, e)}
        className="flex items-center mb-4"
      >
        <Textbox
          type="text"
          className="grow mr-4"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Suchen oder hinzufügen..."
        />
        <Button
          type="submit"
          className="bg-gray-300 !text-black w-9 h-9 p-0 rounded-full active:scale-110 transition"
        >
          +
        </Button>
      </form>
      <div className="grid grid-cols-1 gap-4 mb-4">{renderSavedItems}</div>
    </div>
  );
};

const sortSavedItems = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};
