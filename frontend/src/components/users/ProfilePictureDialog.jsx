import React, {useEffect, useRef, useState} from 'react';
import {DialogActions, DialogTitle, Modal, ModalDialog, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useDispatch} from "react-redux";
import {showError} from "../../redux/AlertActions";
import PropTypes from "prop-types";
import {useMobileSize} from "../../utils/MediaQuery";

const ProfilePictureDialog = ({open, updateProfilePicture, close}) => {

    const [file, setFile] = useState(null);
    const inputRef = useRef();
    const labelRef = useRef();
    const dispatch = useDispatch();
    const mobile = useMobileSize();
    const [imageString, setImageString] = useState(null);

    useEffect(() => {
        if (file) {
            setImageString(URL.createObjectURL(file))
        }
    }, [file]);

    useEffect(() => {
        const listener = (e) => {
            if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
                e.preventDefault();
            }
        }
        window.addEventListener("drop", listener);
        return () => {
            window.removeEventListener("drop", listener)
        }
    }, []);

    const highlightDropField = () => {
        labelRef.current.style.backgroundColor = "rgba(55,255,0,0.2)";
    }

    const clearDropFieldHighlight = () => {
        labelRef.current.style.backgroundColor = "";
    }

    const commonVerify = (files) => {
        if (files[0].size > 5242880) {
            inputRef.current.value = ""
            dispatch(showError("Maksymalny rozmiar zdjęcia profilowego to 5MB"))
            return;
        }
        if (!files[0].type.startsWith("image/")) {
            inputRef.current.value = ""
            dispatch(showError("Wybrany plik musi być obrazem"))
            return;
        }
        setFile(files[0])
    }
    const verifyFile = (e) => {
        commonVerify(e.target.files)
    }

    const verifyDroppedFile = (e) => {
        const files = e.dataTransfer.files;
        commonVerify(files);
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Wybierz zdjęcie</DialogTitle>
                <form onSubmit={e => {
                    e.preventDefault();
                    updateProfilePicture(file)
                    setImageString(null)
                    close();
                }}>
                    <div style={{
                        height: mobile ? 250 : 400, width: mobile ? 250 : 400, display: "flex",
                        justifyContent: "center", alignItems: "center",
                        position: "relative"
                    }}>
                        {imageString &&
                            <img alt={"Avatar clip"} style={{position: "absolute"}} src={"/avatar_clip.svg"}/>}
                        {!imageString && <>
                            <label id={"myFileLabel"}
                                   ref={labelRef}
                                   htmlFor="myFile"
                                   onDragOver={e => {
                                       e.preventDefault()
                                       e.dataTransfer.dropEffect = "copy";
                                       highlightDropField();
                                   }}
                                   onDrop={e => {
                                       clearDropFieldHighlight();
                                       verifyDroppedFile(e)
                                   }}
                                   onDragLeave={e => {
                                       e.stopPropagation()
                                       clearDropFieldHighlight();
                                   }}
                                   style={{
                                       display: "flex",
                                       justifyContent: "center",
                                       alignItems: "center",
                                       width: "100%",
                                       height: "100%"
                                   }}>
                                <Typography style={{pointerEvents: "none"}}>
                                    Upuść plik lub kliknij tutaj
                                </Typography>
                            </label>
                            <input ref={inputRef}
                                   type="file"
                                   id="myFile"
                                   onChange={verifyFile}
                                   name="filename"
                                   accept="image/png, image/gif, image/jpeg"
                                   style={{display: "none"}}
                            />
                        </>}
                        {imageString && <img alt={"User avatar"}
                                             style={{width: mobile ? 250 : 400, height: "100%", objectFit: "cover"}}
                                             src={imageString}/>}
                        <div></div>
                    </div>


                    <DialogActions>
                        {imageString && <Button variant={"outlined"} color={"neutral"} onClick={() => {
                            setImageString(null)
                        }}>Cofnij</Button>}

                        {imageString && <Button type={"submit"}>Zapisz</Button>}

                        {!imageString && <Button variant={"outlined"} color={"neutral"} onClick={() => {
                            setImageString(null)
                            close();
                        }}>Anuluj</Button>}
                    </DialogActions>
                </form>
            </ModalDialog>
        </Modal>
    );
};

ProfilePictureDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    updateProfilePicture: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
}

export default ProfilePictureDialog;