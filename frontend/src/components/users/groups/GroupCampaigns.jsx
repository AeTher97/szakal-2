import React, {useState} from 'react';
import {Autocomplete, Card, CardActions, CardContent, Divider, IconButton, Typography} from "@mui/joy";
import {useCampaignsList} from "../../../data/CampaignData";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";

const CHOOSE_VALUE = {id: "choose", label: "Wybierz", disabled: true};

const GroupCampaigns = ({groupCampaigns, save, saveLoading, addCampaign, deleteCampaign}) => {

    const {campaigns, loading} = useCampaignsList();
    const [inputValue, setInputValue] = useState("");

    const getOptionDisabled = (option) => {
        return option.disabled
    }

    const isOptionEqualToValue = (option, value) => {
        return value.id === option.id
    }

    const campaignsOptions = campaigns.filter(campaign =>
        !groupCampaigns.map(groupCampaign => groupCampaign.id).includes(campaign.id)).map((campaign) => {
        return {
            label: campaign.name,
            id: campaign.id
        }
    });
    campaignsOptions.push(CHOOSE_VALUE)

    return (
        <Card style={{flex: 1}}>
            <CardContent>
                <Typography level={"title-md"}>Akcje grupy</Typography>
                <Divider style={{marginTop: 10}} inset={"context"}/>
                {groupCampaigns.length === 0 &&
                    <div style={{display: "flex", justifyContent: "center", padding: 6, paddingBottom: 8}}>
                        <Typography>Brak akcji</Typography>
                    </div>}
                {groupCampaigns.map((campaign, index) => {
                    return <div key={campaign.id}>
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Typography>{campaign.name}</Typography>
                            <IconButton>
                                <DeleteIcon onClick={() => deleteCampaign(campaign.id)}/>
                            </IconButton>
                        </div>
                        {index + 1 !== groupCampaigns.length && <Divider inset={"context"}/>}

                    </div>
                })}
                <Divider inset={"context"} style={{marginBottom: 10}}/>
                <Autocomplete loading={loading}
                              value={CHOOSE_VALUE}
                              disableClearable
                              options={campaignsOptions}
                              getOptionDisabled={getOptionDisabled}
                              isOptionEqualToValue={isOptionEqualToValue}
                              inputValue={inputValue}
                              onInputChange={(e, value) => {
                                  setInputValue(value)
                              }}
                              onChange={(e, inputValue) => {
                                  addCampaign(campaigns.find(campaign => campaign.id === inputValue.id));
                                  setInputValue("")
                              }}
                />
            </CardContent>
            <CardActions>
                <Button onClick={save} loading={saveLoading}>Zapisz</Button>
            </CardActions>
        </Card>
    );
};

GroupCampaigns.propTypes = {
    groupCampaigns: PropTypes.array.isRequired,
    save: PropTypes.func.isRequired,
    saveLoading: PropTypes.bool,
    addCampaign: PropTypes.func.isRequired,
    deleteCampaign: PropTypes.func.isRequired
}

export default GroupCampaigns;