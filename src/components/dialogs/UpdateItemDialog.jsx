import { useEffect, useState } from "react";
import { Dialog } from "../Dialog";
import { Textbox } from "../Textbox";
import { Button } from "../Button";
import { CategorySelect } from "../selects/CategorySelect";
import { UnitSelect } from "../selects/UnitSelect";

export const UpdateItemDialog = ({
  item,
  onSubmit,
  onClose,
  savedItems,
  onDelete,
  ...props
}) => {
  const [itemName, setItemName] = useState(item?.name);
  const [unit, setUnit] = useState(item?.unit || "Packung");
  const [stack, setStack] = useState(item?.stack || 1);
  const [category, setCategory] = useState(item?.category || "");
  const [price, setPrice] = useState(item?.price || "");

  useEffect(() => {
    init();
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        id: item?.id,
        name: itemName,
        unit,
        stack,
        category,
        price,
      });
    }

    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    init();
  };

  const init = () => {
    setItemName(item?.name);
    setUnit(item?.unit || "Packung");
    setStack(item?.stack || 1);
    setCategory(item?.category || "");
    setPrice(item?.price || "");
  };

  if (!item) {
    return null;
  }

  return (
    <Dialog title="Produkt bearbeiten" onClose={handleClose} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 mb-4">
          <Textbox
            type="text"
            label="was isch des?"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Textbox
            type="number"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            label="wie viele sind im päckle?"
          />
          <UnitSelect
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            label="Mengeneinheit"
            className="w-full"
          />
          <div>
            <CategorySelect
              label="Kategorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              savedItems={savedItems}
              optional
            />
            <Textbox
              type="text"
              placeholder="Neue Kategorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Textbox
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            label="Preis"
            step=".01"
            optional
          />
        </div>
        <div className="text-right">
          <Button
            className="!bg-red-500 !text-white mr-2"
            onClick={(e) => onDelete(item, e)}
          >
            Löschen
          </Button>
          <Button
            name="submit"
            disabled={
              !itemName ||
              (itemName !== item.name &&
                savedItems.find((v) => v.name === itemName))
            }
            tabIndex={-1}
          >
            Speichern
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
