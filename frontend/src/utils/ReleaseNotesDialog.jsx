import React from 'react';
import {Modal, ModalClose, ModalDialog, Typography} from "@mui/joy";
import PropTypes from "prop-types";

const ReleaseNotesDialog = ({open, close}) => {
    return (
        <Modal open={open} onClose={close}>
            <ModalDialog sx={(theme) => ({
                [theme.breakpoints.only('xs')]: {
                    top: 'unset',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 0,
                    transform: 'none',
                    maxWidth: 'unset',
                },
            })}>
                <ModalClose/>
                <ReleaseNotesTitle title={"Szakal 1.0.1"}/>
                <div style={{overflowY: "auto"}}>
                    <ReleaseNotesSection title={"Nowe funkcjonalności"}>
                        <ReleaseNotesBullet title={"Auto odświeżanie firm i kontaktów"}
                                            description={"Zmiany na liście firm, kontaktów jak i zmiany szczegółów otwartych kontaktów" +
                                                "i firm są odświeżane automatycznie."}/>
                        <ReleaseNotesBullet title={"Dane na temat komitetu dodane do użytkowników"}
                                            description={"Komitet może zostać zmieniony w zakładce profil, " +
                                                "informacje o nim są wyświetlane w kilku miejscach aplikacji, by" +
                                                "ułatwić identyfikację użytkowników."}/>
                        <ReleaseNotesBullet title={"Usuwanie osób kontaktowych"}
                                            description={"Możliwa jest anonimizacja wydarzeń kontaktowych przez " +
                                                "usunięcie osoby kontaktowej z poziomu firmy."}/>
                    </ReleaseNotesSection>
                    <ReleaseNotesSection title={"Naprawione błedy"}>
                        <ReleaseNotesBullet title={"Brak"}/>
                    </ReleaseNotesSection>
                </div>
            </ModalDialog>
        </Modal>
    );
};

const ReleaseNotesTitle = ({title}) => {
    return (
        <Typography
            component="h2"
            id="modal-title"
            level="h3"
            textColor="inherit"
            sx={{fontWeight: 'lg', mb: 1}}
        >
            {title}
        </Typography>
    );
};


const ReleaseNotesSection = ({title, children}) => {
    return (
        <div>
            <Typography level={"h3"}>
                {title}
            </Typography>
            <ul>
                {children}
            </ul>
        </div>
    );
};


const ReleaseNotesBullet = ({title, description}) => {
    return <li>
        <Typography level={"h4"}>{title}</Typography>
        {description && <Typography level={"body-md"}>{description}</Typography>}
    </li>
}

ReleaseNotesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
}

ReleaseNotesTitle.propTypes = {
    title: PropTypes.string.isRequired,
}

ReleaseNotesSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}


ReleaseNotesBullet.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
}

export default ReleaseNotesDialog;