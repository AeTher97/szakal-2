import React, {useState} from 'react';
import {DialogActions, DialogTitle, Modal, ModalDialog} from "@mui/joy";
import Button from "@mui/joy/Button";

const ConfirmationDialog = ({open, close, text, onConfirm, onReject}) => {

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>{text}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => {
                        onReject();
                        close()
                    }} variant={"outlined"} color={"neutral"}>Nie</Button>
                    <Button onClick={() => {
                        onConfirm();
                        close();
                    }}>Tak</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
};

export const useConfirmationDialog = (text) => {
    const [open, setOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(() => {
    })
    const [onReject, setOnReject] = useState(() => {
    })
    const render = () => {
        return <ConfirmationDialog open={open} close={() => {
            setOpen(false)
        }} text={text} onConfirm={onConfirm} onReject={onReject}/>
    }

    const openDialog = (onConfirm = () => {
    }, onReject = () => {
    }) => {
        setOpen(true);
        setOnReject(() => onReject)
        setOnConfirm(() => onConfirm)
    }

    return {openDialog, render}
}