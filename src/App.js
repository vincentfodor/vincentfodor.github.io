import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { ShoppingList } from "./components/ShoppingList";
import { Button } from "./components/Button";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [isPWAUsed, setIsPWAUsed] = useState(false);
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
            setIsPWAUsed(true);
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
            setIsPWAUsed(true);
        }
    };

    const renderTitle = username?.endsWith("s")
        ? `📔 ${username}' Zettel`
        : `📔 ${username}s Zettel`;

    if (!username) {
        return null;
    }

    const renderRightText = () => {
        if (!isPWAUsed && deferredPrompt) {
            return (
                <Button icon={faDownload} onClick={handleInstall}>
                    App installieren
                </Button>
            );
        } else if (!isPWAUsed && !deferredPrompt) {
            return (
                <span className="text-xs w-40 block">
                    Du benötigst Google Chrome, um die App zu installieren
                </span>
            );
        }

        return null;
    };

    return (
        <div className="max-w-screen-md mx-auto lg:pt-16">
            <Header title={renderTitle} rightText={renderRightText()} />
            <ShoppingList storageName="main" itemStorageName="main-items" />
        </div>
    );
}

export default App;
