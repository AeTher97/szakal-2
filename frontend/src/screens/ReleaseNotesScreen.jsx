import React from 'react';
import {ReleaseNotesBullet, ReleaseNotesSection, ReleaseNotesTitle} from "../utils/ReleaseNotesUtils";

export const releaseNotes = [
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
                                        "informacje o nim są wyświetlane w kilku miejscach aplikacji, by" +
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
    return releaseNotes.map((notes, i) =>
        <div style={{marginLeft: 5}} key={i}>
            {notes}
        </div>
    );
};

export default ReleaseNotesScreen;
