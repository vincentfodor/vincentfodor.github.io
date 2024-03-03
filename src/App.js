import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { ShoppingList } from "./components/ShoppingList";
import { Button } from "./components/Button";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [isPWAInstalled, setIsPWAInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        if (!username) {
            promptUsername();
        }
    }, []);

    const promptUsername = () => {
        const newUsername = prompt("sag mir dein name", "Phil");

        if (!newUsername) {
            return promptUsername();
        }

        setUsername(newUsername);

        localStorage.setItem("username", newUsername);
    };

    useEffect(() => {
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsPWAInstalled(true);
        }

        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();

            setDeferredPrompt(e);
        });
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome) {
            setIsPWAInstalled(true);
        }
    };

    const renderTitle = username?.endsWith("s")
        ? `📔 ${username}' Zettel`
        : `📔 ${username}s Zettel`;

    if (!username) {
        return null;
    }

    return (
        <div className="">
            <Header
                title={renderTitle}
                rightText={
                    !isPWAInstalled &&
                    deferredPrompt && (
                        <Button icon={faDownload} onClick={handleInstall}>
                            App installieren
                        </Button>
                    )
                }
            />
            <ShoppingList storageName="main" itemStorageName="main-items" />
        </div>
    );
}

export default App;
