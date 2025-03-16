import React, {useEffect, useRef, useState} from 'react';
import {DialogTitle, FormLabel, Input, Modal, ModalDialog} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useJoinGroup} from '../../../data/GroupsData';
import {useDispatch, useSelector} from "react-redux";
import {reloadAction} from "../../../redux/MiscActions";
import {showSuccess} from "../../../redux/AlertActions";
import {v4 as uuidv4} from 'uuid';
import PropTypes from "prop-types";

const CODE_LENGTH = 7;
const INITIAL_STATE = [
    "", "", "", "", "", "", ""
];

const isNumeric = (str) => {
    return /^\d+$/.test(str);
}

const JoinGroupDialog = ({open, close}) => {

    const joinGroup = useJoinGroup();
    const {theme} = useSelector(state => state.theme);

    const dispatch = useDispatch();
    const [code, setCode] = useState(INITIAL_STATE);
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const ref5 = useRef();
    const ref6 = useRef();
    const ref7 = useRef();

    const refs = [ref1, ref2, ref3, ref4, ref5, ref6, ref7];

    const fieldArray = Array.from(Array(CODE_LENGTH).keys())

    useEffect(() => {
        if (open) {
            document.addEventListener("paste", onPaste);
        } else {
            document.removeEventListener("paste", onPaste);
        }
        return () => {
            document.removeEventListener("paste", onPaste);
        }
    }, [open]);

    const setText = (text) => {
        const chars = text.split('');
        setCode(chars.slice(0, CODE_LENGTH));
        refs[CODE_LENGTH - 1].current.focus();
    }

    const onPaste = (event) => {
        const copiedTest = event.clipboardData.getData('Text');
        if (!isNumeric(copiedTest)) {
            return;
        }
        const chars = copiedTest.split('');
        if (chars.length < CODE_LENGTH) {
            return;
        }
        setText(copiedTest);
        setTimeout(() => {
            copiedTest.split("").forEach((char, i) => {
                    refs[i].current.value = char;
                }
            )
        }, 15)
    }

    const checkCode = (codeToCheck) => {
        let emptyCount = 0;
        for (let i in codeToCheck) {
            if (codeToCheck[i] === "") {
                emptyCount++;
            }
        }
        return emptyCount === 0;
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dołącz do grupy użytkowników</DialogTitle>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        let codeToUse;
                        const codeFromFields = [
                            ref1.current.value,
                            ref2.current.value,
                            ref3.current.value,
                            ref4.current.value,
                            ref5.current.value,
                            ref6.current.value,
                            ref7.current.value,
                        ]

                        if (checkCode(codeFromFields)) {
                            codeToUse = codeFromFields;
                        } else if (checkCode(code)) {
                            codeToUse = code;
                        } else {
                            return;
                        }

                        joinGroup(codeToUse.join("")).then((res) => {
                            dispatch(showSuccess("Dołączono do grupy " + res.name));
                            dispatch(reloadAction())
                            setCode(INITIAL_STATE);
                            close();
                        }).catch(() => {
                        })
                    }}>
                    <FormLabel>Podaj kod grupy</FormLabel>
                    <div style={{
                        display: "flex",
                        paddingBottom: 15,
                        paddingTop: 10,
                        justifyContent: "space-around",
                        gap: 10
                    }}>
                        {fieldArray.map((o, index) => {
                            const ref = refs[index];
                            return <Input
                                type={"text"}
                                maxLength={1}
                                slotProps={{input: {ref}}}
                                key={uuidv4()}
                                sx={{
                                    "& input": {
                                        textAlign: 'center',
                                        fontSize: 30
                                    }
                                }}
                                style={{
                                    width: 40,
                                    height: 50,
                                    padding: 5,
                                    backgroundColor: theme === "dark" ? "#191919" : "#ececec",
                                    boxShadow: "none",
                                    textAlign: "center"
                                }}
                                onChange={e => {
                                    e.preventDefault();
                                    const value = e.target.value;
                                    if (e.nativeEvent.inputType === "insertFromPaste") {
                                        if (value.length === 7) {
                                            onPaste(value);
                                        }
                                        return;
                                    }
                                    const character = value.substring(value.length - 1, value.length);
                                    if (!isNumeric(character)) {
                                        refs[index].current.value = "";
                                        return;
                                    }
                                    if (index === CODE_LENGTH - 1 && value.length !== 0) {
                                        refs[index].current.value = character;
                                        return;
                                    }
                                    if (index !== CODE_LENGTH - 1 && value.length !== 0) {
                                        refs[index].current.value = character;
                                        refs[index + 1].current.focus({fromCode: true});
                                        return;
                                    }
                                    if (value.length === 0 && index !== 0) {
                                        refs[index - 1].current.selectionStart = 10000;
                                    }
                                }}
                                onFocus={() => {
                                    if (refs[index].current.value.length === 1) {
                                        refs[index].current.setSelectionRange(0, 1);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.code !== "Backspace" && e.key !== "Backspace") {
                                        return
                                    }
                                    const localRef = refs[index].current;
                                    const value = localRef.value;
                                    if (value.length === 0 && index !== 0) {
                                        setTimeout(() => refs[index - 1].current.focus({fromCode: true}),
                                            10);
                                        setTimeout(() => {
                                            refs[index - 1].current.selectionStart = 10000;
                                        }, 2)

                                    } else if (!index - 1 < 0) {
                                        setTimeout(() => refs[index - 1].current.focus({fromCode: true}),
                                            10);
                                    }
                                }}/>
                        })
                        }
                    </div>
                    <div style={{display: "flex", gap: 5}}>
                        <Button type={"submit"}>Dołącz</Button>
                        <Button color={"neutral"} onClick={() => {
                            setCode(INITIAL_STATE)
                            close();
                        }}>
                            Anuluj
                        </Button>
                    </div>
                </form>
            </ModalDialog>
        </Modal>
    );
};

JoinGroupDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired
}

export default JoinGroupDialog;