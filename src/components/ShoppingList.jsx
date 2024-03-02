import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";

export const ShoppingList = ({
  className,
  storageName,
  itemStorageName,
  ...props
}) => {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    const itemList = localStorage.getItem(itemStorageName);
    const savedList = localStorage.getItem(storageName);

    if (itemList) {
      try {
        const parsedItemList = JSON.parse(itemList);

        setItems(parsedItemList);
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

  const handleItemDelete = (item) => {
    const newItems = items.filter((v) => v.id !== item.id);

    setItems(newItems);
    save(itemStorageName, newItems);
  };

  const handleItemAdd = (name, e) => {
    if (e) {
      e.preventDefault();
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
        (v) => v.name.toLowerCase() === name.toLowerCase()
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

      const newSavedItems = [
        ...savedItems,
        {
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

  const save = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  };

  const filteredSavedItems = (savedItems || [])
    .filter((item) => item.name.toLowerCase().includes(itemName.toLowerCase()))
    .sort(sortSavedItems);

  const renderItems = (items || []).map((item) => (
    <div className="flex flex-row items-center">
      <div className="flex flex-col grow py-2 font-semibold">{item.name}</div>
      <div className="py-2 pr-4">{`${item.quantity} ${item.unit}`}</div>
      <div>
        <Button
          className="bg-green-500 w-9 h-9 p-0 rounded-full active:scale-110 transition"
          onClick={() => handleItemDelete(item)}
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
          onClick={() => handleItemAdd(item.name)}
          className="bg-gray-300 text-black w-9 h-9 p-0 rounded-full active:scale-110 transition"
        >
          +
        </Button>
      </div>
    </div>
  ));

  return (
    <div className={classNames(className, "p-4")}>
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
          className="bg-gray-300 text-black w-9 h-9 p-0 rounded-full active:scale-110 transition"
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
