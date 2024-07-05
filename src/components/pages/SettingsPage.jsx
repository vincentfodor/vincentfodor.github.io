import { faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import { useRef } from "react";
import { NavLink } from "react-router-dom";

export const SettingsPage = () => {
  const inputRef = useRef();
  const localStorageSizeInMB = getObjectSize(localStorage);

  const handleExport = () => {
    download(localStorage.getItem("main"), "zettel-data.json");
  };

  const handleImport = () => {
    console.log(inputRef.current);

    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (
      !window.confirm(
        "Willst du wirklich deine Daten überschreiben? Diese Aktion kann nicht rückgängig gemacht werden"
      )
    ) {
      return;
    }

    let fr = new FileReader();
    fr.onload = function () {
      if (!fr.result) {
        return;
      }

      try {
        JSON.parse(fr.result);

        localStorage.setItem("main", fr.result);
      } catch {
        alert(
          "Die Datei konnte nicht geladen werden, bitte stelle sicher, dass es sich um eine JSON-Datei handelt"
        );
      }
    };

    fr.readAsText(file);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <NavLink to="/">Zurück</NavLink>
      </div>
      <div className="mb-8">
        <h3 className="font-bold mb-1">Daten</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button icon={faFileExport} onClick={handleExport}>
            Exportieren
          </Button>
          <Button icon={faFileImport} onClick={handleImport}>
            Importieren
          </Button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Speicherplatz verfügbar</h3>
        <ProgressBar
          value={localStorageSizeInMB}
          min={0}
          max={10}
          leftLabel={`${localStorageSizeInMB.toFixed(2)} mb`}
          rightLabel={"10 mb"}
        />
      </div>
      <input
        accept="application/json"
        type="file"
        hidden
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

const getObjectSize = (object) => {
  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    switch (typeof value) {
      case "boolean":
        bytes += 4;
        break;
      case "string":
        bytes += value.length * 2;
        break;
      case "number":
        bytes += 8;
        break;
      case "object":
        if (!objectList.includes(value)) {
          objectList.push(value);
          for (const prop in value) {
            if (value.hasOwnProperty(prop)) {
              stack.push(value[prop]);
            }
          }
        }
        break;
    }
  }

  return bytes / 1000000;
};

const download = (content, filename, contentType) => {
  if (!contentType) {
    contentType = "application/octet-stream";
  }

  const a = document.createElement("a");
  const blob = new Blob([content], { type: contentType });

  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};
