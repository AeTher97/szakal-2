import React from 'react';
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import PropTypes from "prop-types";
import {releaseNotes} from "../screens/ReleaseNotesScreen";
import Link from "@mui/joy/Link";

const ReleaseNotesDialog = ({open, close}) => {
    return (
        <Modal open={open} onClose={close}>
            <ModalDialog data-testid="release-notes-dialog"
                         sx={(theme) => ({
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
                {releaseNotes[0]}
                <Link href={"/release-notes"}>Zobacz cała historie zmian</Link>
            </ModalDialog>
        </Modal>
    );
};

ReleaseNotesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
}

export default ReleaseNotesDialog;