import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export const ImprintPage = () => {
    return (
        <div className="p-4">
            <Link to="/">
                <Button icon={faChevronLeft} className="mb-2">
                    Zurück
                </Button>
            </Link>
            <h1 className="text-xl font-bold mb-4">Impressum</h1>
            <p>Angaben gemäß § 5 TMG</p>
            <p className="mb-4">
                Vincent Fodor <br />
                Alte Stuttgarter Straße 103
                <br />
                70195 Stuttgart <br />
            </p>
            <p className="mb-4">
                <strong>Vertreten durch: </strong>
                <br />
                Vincent Fodor
                <br />
            </p>
            <p className="mb-8">
                <strong>Kontakt:</strong> <br />
                Telefon: +49-1522 6269690
                <br />
                E-Mail: <a href="mailto:vincent@yrm.app">vincent@yrm.app</a>
            </p>
            <h1 className="text-xl font-bold mb-4">Haftungsausschluss:</h1>
            <h2 className="text-lg font-bold mb-4">Datenschutz</h2>
            <p>
                Die Nutzung unserer Webseite ist in der Regel ohne Angabe
                personenbezogener Daten möglich. Soweit auf unseren Seiten
                personenbezogene Daten (beispielsweise Name, Anschrift oder
                eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich,
                stets auf freiwilliger Basis. Diese Daten werden ohne Ihre
                ausdrückliche Zustimmung nicht an Dritte weitergegeben. Wir
                weisen darauf hin, dass die Datenübertragung im Internet (z.B.
                bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen
                kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch
                Dritte ist nicht möglich. Der Nutzung von im Rahmen der
                Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur
                Übersendung von nicht ausdrücklich angeforderter Werbung und
                Informationsmaterialien wird hiermit ausdrücklich widersprochen.
                Die Betreiber der Seiten behalten sich ausdrücklich rechtliche
                Schritte im Falle der unverlangten Zusendung von
                Werbeinformationen, etwa durch Spam-Mails, vor.
            </p>
        </div>
    );
};
