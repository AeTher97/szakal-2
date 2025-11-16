import React from 'react';
import {ReleaseNotesBullet, ReleaseNotesSection, ReleaseNotesTitle} from "../utils/ReleaseNotesUtils";

export const releaseNotes = [
    <>
        <ReleaseNotesTitle title={"Szakal 1.4"}/>
        <div style={{overflowY: "auto"}}>
            <ReleaseNotesSection title={"Nowe funkcjonalności"}>
                <ReleaseNotesBullet title={"Powiadomienia o zmianach w Twoich kontaktach"}
                                    description={"Jeśli wyrazisz zgodę na Twoje urządzenie będą przychodzić powiadomienia push gdy ktoś zamieści komentarz albo wydarzenie kontaktowe w Twoim kontakcie."}/>
                <ReleaseNotesBullet title={"Potwierdzanie adresu E-mail"}
                                    description={"Przez zdarzające sie błędy w adresach E-mail, które uniemożliwiały resetowanie hasła, E-mail musi być teraz potwierdzony po rejestacji."}/>
            </ReleaseNotesSection>
            <ReleaseNotesSection title={"Naprawione błędy"}>
                <ReleaseNotesBullet title={"Poprawione placeholdery w wielu miejscach"}/>
                <ReleaseNotesBullet
                    title={"Rejestracja użytkowników nie pozwala już stwierdzić jakie E-maile są w użytku"}/>
            </ReleaseNotesSection>
        </div>
    </>,
    <>
        <ReleaseNotesTitle title={"Szakal 1.3"}/>
        <div style={{overflowY: "auto"}}>
            <ReleaseNotesSection title={"Nowe funkcjonalności"}>
                <ReleaseNotesBullet title={"Ładniejsza formatka do wrzucania zdjęć profilowych"}
                                    description={"Możliwe jest przciąganie zdjęcia profilowego do przeglądarki i wygląda to ładniej."}/>
                <ReleaseNotesBullet title={"Edycja komentarzy i wydarzeń kontatkowych"}
                                    description={"Komentarze i wydarzenia kontaktowe które były edytowane, sa teraz opatrzone dopiskiem - (Edytowane)."}/>
            </ReleaseNotesSection>
            <ReleaseNotesSection title={"Naprawione błędy"}>
                <ReleaseNotesBullet title={"Usuwanie niezaakceptowanych użytkowników, którzy próbowali resetować hasło"}
                                    description={"Tokeny resetu hasła są usuwane dla tych użytkowników automatycznie, usuwanie nie rzuca już Internal Server Error."}/>
                <ReleaseNotesBullet title={"Dodawanie i modyfikacja kategorii"}
                                    description={"Dodawanie i modyfikacja kategori nie rzuca już błędu bad request."}/>
                <ReleaseNotesBullet title={"Sortowanie"}
                                    description={"Zmiana rozmiaru strony nie resetuje już sortowania kolumn."}/>
            </ReleaseNotesSection>
        </div>
    </>,
    <>
        <ReleaseNotesTitle title={"Szakal 1.2"}/>
        <div style={{overflowY: "auto"}}>
            <ReleaseNotesSection title={"Nowe funkcjonalności"}>
                <ReleaseNotesBullet title={"Edytowanie komentarzy i wydarzeń kontaktowych"}
                                    description={"Komentarze i wydarzenia kontaktowe na stronie kontaktu z firmą mogą być edytowane przez użytkownika który stworzył wpis."}/>
            </ReleaseNotesSection>
            <ReleaseNotesSection title={"Naprawione błędy"}>
                <ReleaseNotesBullet title={"Brak"}/>
            </ReleaseNotesSection>
        </div>
    </>,
    <>
        <ReleaseNotesTitle title={"Szakal 1.1"}/>
        <div style={{overflowY: "auto"}}>
            <ReleaseNotesSection title={"Nowe funkcjonalności"}>
                <ReleaseNotesBullet title={"Auto odświeżanie firm i kontaktów"}
                                    description={"Zmiany na liście firm, kontaktów jak i zmiany szczegółów otwartych kontaktów" +
                                        " i firm są odświeżane automatycznie."}/>
                <ReleaseNotesBullet title={"Dane na temat komitetu dodane do użytkowników"}
                                    description={"Komitet może zostać zmieniony w zakładce profil, " +
                                        "informacje o nim są wyświetlane w kilku miejscach aplikacji, by " +
                                        "ułatwić identyfikację użytkowników."}/>
                <ReleaseNotesBullet title={"Usuwanie osób kontaktowych"}
                                    description={"Możliwa jest anonimizacja wydarzeń kontaktowych przez " +
                                        "usunięcie osoby kontaktowej z poziomu firmy."}/>
            </ReleaseNotesSection>
            <ReleaseNotesSection title={"Naprawione błędy"}>
                <ReleaseNotesBullet title={"Brak"}/>
            </ReleaseNotesSection>
        </div>
    </>
]

const ReleaseNotesScreen = () => {
    return <div style={{padding: 5}}>
        {releaseNotes.map((notes, i) =>
            <div style={{marginLeft: 5}} key={i}>
                {notes}
            </div>
        )}
    </div>
};

export default ReleaseNotesScreen;
