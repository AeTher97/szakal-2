import React, {useState} from 'react';
import {DialogTitle, FormControl, FormLabel, Modal, ModalDialog, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import UserAutocomplete from "../misc/UserAutocomplete";
import PropTypes from "prop-types";

const AssignToSomeoneElseDialog = ({
                                       open,
                                       close,
                                       addJourney,
                                       currentCampaign,
                                       companyId,
                                       navigate,
                                       fromJourneyPage
                                   }) => {

    const [user, setUser] = useState(null);

    const clear = () => {
        setUser("")
    }

    return (
        <Modal open={open}>
            <ModalDialog>
                <DialogTitle>Przypisz firmę do osoby</DialogTitle>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    if (!user) {
                        return;
                    }
                    addJourney(currentCampaign, companyId, user.id)
                        .then((data) => {
                            clear()
                            if (!fromJourneyPage) {
                                navigate(`/secure/journeys/${data.id}`)
                            } else {
                                navigate(0);
                            }
                        })
                }}>
                    <Stack spacing={2}>
                        <FormControl required>
                            <FormLabel>Użytkownik do przypisania</FormLabel>
                            <UserAutocomplete setUser={setUser} clearOnSelect={false}/>
                        </FormControl>
                        <Button type="submit">Zapisz</Button>
                        <Button color={"neutral"} onClick={() => {
                            clear()
                            close()
                        }}>Anuluj</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
        ;
};

AssignToSomeoneElseDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    addJourney: PropTypes.func.isRequired,
    currentCampaign: PropTypes.string.isRequired,
    companyId: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    fromJourneyPage: PropTypes.bool.isRequired
}

export default AssignToSomeoneElseDialog;