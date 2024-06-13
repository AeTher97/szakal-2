import React, {useEffect, useRef, useState} from 'react';
import {DialogActions, DialogTitle, Modal, ModalDialog} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useDispatch} from "react-redux";
import {showError} from "../../redux/AlertActions";

const ProfilePictureDialog = ({open, updateProfilePicture, close}) => {

    const [file, setFile] = useState(null);
    const ref = useRef();
    const dispatch = useDispatch();
    const [imageString, setImageString] = useState(null);

    useEffect(() => {
        if (file) {
            setImageString(URL.createObjectURL(file))
        }
    }, [file]);

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
                        width: 300, height: 300, display: "flex", justifyContent: "center", alignItems: "center"
                        , position: "relative"
                    }}>
                        {imageString && <img style={{position: "absolute"}} src={"/avatar_clip.svg"}/>}
                        {!imageString && <input ref={ref} type="file" id="myFile" onChange={(e) => {
                            if(e.target.files[0].size > 524288) {
                                ref.current.value = ""
                                dispatch(showError("Maksymalny rozmiar zdjęcia profilowego to 0.5MB"))
                                return;
                            }
                            setFile(e.target.files[0])
                        }} name="filename" accept="image/png, image/gif, image/jpeg"/>}
                        {imageString && <img style={{width: 300, height: 300,objectFit: "cover"}} src={imageString}/>}
                        <div></div>
                    </div>


                    <DialogActions>
                        {imageString && <Button variant={"outlined"} color={"neutral"} onClick={() => {
                            setImageString(null)
                        }}>Cofnij</Button>}

                        {imageString && <Button type={"submit"} >Zapisz</Button>}

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

export default ProfilePictureDialog;