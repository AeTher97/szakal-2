import React, { useRef, useState } from 'react';
import { DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";
import { useJoinGroup } from '../../../data/GroupsData';

const CODE_LENGTH = 7;

const isNumeric = (str) => {
    return /^\d+$/.test(str);
}

const JoinGroupDialog = ({ open, close }) => {

    const joinGroup = useJoinGroup();
    const [code, setCode] = useState([
        "", "", "", "", "", "", ""
    ]);
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const ref5 = useRef();
    const ref6 = useRef();
    const ref7 = useRef();

    const refs = [ref1, ref2, ref3, ref4, ref5, ref6, ref7];

    const fieldArray = Array.from(Array(CODE_LENGTH).keys())


    const setCodeCharacter = (index, character) => {
        const tempCode = [...code];
        tempCode[index] = character;
        setCode(tempCode);
    }

    const onPaste = (event) => {
        const copiedTest = event.clipboardData.getData('Text');
        console.log(copiedTest);
        if (!isNumeric(copiedTest)) {
            return;
        }
        const chars = copiedTest.split('');
        if (chars.length < CODE_LENGTH) {
            return;
        }
        setCode(chars.slice(0, CODE_LENGTH));
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dołącz do grupy użytkowników</DialogTitle>
                <form
                    onSubmit={(event, value) => {
                        event.preventDefault();
                    }}>
                    <FormLabel>Podaj kod grupy</FormLabel>
                    <div style={{ display: "flex", paddingBottom: 10, paddingTop: 10, justifyContent: "space-around", gap: 10 }}>
                        {fieldArray.map((o, index) => {
                            const ref = refs[index];
                            return <Input
                                slotProps={{ input: { ref } }}
                                key={index}
                                sx={{
                                    "& input": {
                                        textAlign: 'center',
                                        fontSize: 30
                                    }
                                }}
                                style={{
                                    width: 45,
                                    height: 60,
                                    padding: 5,
                                    backgroundColor: "#191919",
                                    borderBottom: "1px solid red",
                                    boxShadow: "none",
                                    border: "none",
                                    textAlign: "center"
                                }}
                                onChange={e => {
                                    if (e.nativeEvent.inputType === "insertFromPaste") {
                                        return;
                                    }
                                    const value = e.target.value;
                                    const character = value.substring(value.length - 1, value.length);
                                    if (!isNumeric(character) && character.length !== 0) {
                                        return;
                                    }
                                    setCodeCharacter(index, character);
                                    if (index !== CODE_LENGTH - 1 && value.length !== 0) {
                                        refs[index + 1].current.focus();
                                    }
                                    if (value.length === 0 && index !== 0) {
                                        refs[index - 1].current.focus();
                                    }

                                }}
                                onPaste={onPaste}
                                value={code[index]} />
                        })}
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                        <Button onClick={() => {
                            joinGroup(code.join("")).then(() => {
                                window.location.reload();
                            })
                        }}>Dołącz</Button>
                        <Button color={"neutral"} onClick={close}>Anuluj</Button>
                    </div>
                </form>
            </ModalDialog>
        </Modal>
    );
};

export default JoinGroupDialog;