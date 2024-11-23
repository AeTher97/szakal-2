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


    const setCodeCharacter = (index, character) => {
        const tempCode = [...code];
        tempCode[index] = character;
        setCode(tempCode);
    }

    const setText = (text) => {
        if (!isNumeric(text)) {
            return;
        }
        const chars = text.split('');
        if (chars.length < CODE_LENGTH) {
            return;
        }
        setCode(chars.slice(0, CODE_LENGTH));
        refs[CODE_LENGTH - 1].current.focus();
    }

    const onPaste = (event) => {
        const copiedTest = event.clipboardData.getData('Text');
        setText(copiedTest);
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Dołącz do grupy użytkowników</DialogTitle>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
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
                                    // border: "none",
                                    textAlign: "center"
                                }}
                                onChange={e => {
                                    e.preventDefault();
                                    if (e.nativeEvent.inputType === "insertFromPaste") {
                                        return;
                                    }
                                    const value = e.target.value;
                                    if (value.length === 7) {
                                        setText(value);
                                        refs[CODE_LENGTH - 1].current.focus({fromCode: true});
                                        return;
                                    }
                                    const character = value.substring(value.length - 1, value.length);
                                    if (!isNumeric(character) && character.length !== 0) {
                                        return;
                                    }
                                    setCodeCharacter(index, character);
                                    if (index !== CODE_LENGTH - 1 && value.length !== 0) {
                                        const localRef = refs[index + 1].current;
                                        localRef.focus({fromCode: true});
                                    }
                                    if (value.length === 0 && index !== 0) {
                                        const localRef = refs[index - 1].current;
                                        localRef.focus({fromCode: true});
                                        setTimeout(() => {
                                            localRef.selectionStart = 10000;
                                        }, 1)
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
                                        const previusRef = refs[index - 1].current;
                                        previusRef.focus({fromCode: true});
                                        setTimeout(() => {
                                            previusRef.selectionStart = 10000;
                                        }, 2)

                                    }
                                }
                                }
                                value={code[index]}/>
                        })
                        }
                    </div>
                    <div style={{display: "flex", gap: 5}}>
                        <Button onClick={() => {
                            let emptyCount = 0;
                            for (let i in code) {
                                if (code[i] === "") {
                                    emptyCount++;
                                }
                            }
                            if (emptyCount > 0) {
                                return;
                            }

                            joinGroup(code.join("")).then((res) => {
                                dispatch(showSuccess("Dołączono do grupy " + res.name));
                                dispatch(reloadAction())
                                setCode(INITIAL_STATE);
                                close();
                            }).catch(() => {
                            })
                        }}>Dołącz</Button>
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