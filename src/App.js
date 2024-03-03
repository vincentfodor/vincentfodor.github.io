import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { ShoppingList } from "./components/ShoppingList";
import { Button } from "./components/Button";
import {
    faDownload,
    faVolumeHigh,
    faVolumeTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Route, Router, Routes } from "react-router-dom";
import { ImprintPage } from "./pages/ImprintPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [isPWAUsed, setIsPWAUsed] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isMuted, setIsMuted] = useState(
        localStorage.getItem("muted") === "true"
    );

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

        if (outcome === "accepted") {
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
                <div className="flex items-center">
                    <Button
                        className="mr-4"
                        icon={faDownload}
                        onClick={handleInstall}
                    >
                        App installieren
                    </Button>
                    <FontAwesomeIcon
                        icon={isMuted ? faVolumeTimes : faVolumeHigh}
                        onClick={() => {
                            setIsMuted(!isMuted);

                            localStorage.setItem("muted", !isMuted);
                        }}
                    />
                </div>
            );
        } else if (!isPWAUsed && !deferredPrompt) {
            return (
                <div className="flex items-center">
                    <span className="text-xs w-40 block mr-4">
                        Du benötigst Google Chrome, um die App zu installieren
                    </span>
                    <FontAwesomeIcon
                        icon={isMuted ? faVolumeTimes : faVolumeHigh}
                        onClick={() => {
                            setIsMuted(!isMuted);

                            localStorage.setItem("muted", !isMuted);
                        }}
                    />
                </div>
            );
        }

        return (
            <FontAwesomeIcon
                icon={isMuted ? faVolumeTimes : faVolumeHigh}
                onClick={() => {
                    setIsMuted(!isMuted);

                    localStorage.setItem("muted", !isMuted);
                }}
            />
        );
    };

    return (
        <div className="max-w-screen-md mx-auto lg:pt-16">
            <Header title={renderTitle} rightText={renderRightText()} />
            <div className="h-[73px] md:hidden"></div>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <ShoppingList
                            storageName="main"
                            itemStorageName="main-items"
                            isMuted={isMuted}
                        />
                    }
                />
                <Route exact path="/impressum" element={<ImprintPage />} />
            </Routes>
            <div className="text-center my-4">
                <Link to="/impressum">Impressum</Link>
            </div>
        </div>
    );
}

export default App;
