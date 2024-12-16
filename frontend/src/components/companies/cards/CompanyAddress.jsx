import React, {useEffect} from 'react';
import {useMobileSize} from "../../../utils/MediaQuery";
import {Card, CardActions, CardContent, Divider, FormControl, FormLabel, Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import {COMPANY_MODIFICATION} from "../../../utils/AccessRightsList";
import PropTypes from "prop-types";
import {InputWithLimit} from "../../misc/InputWithLimit";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";
import {UseFormValidation} from "../../../utils/UseFormValidation";

const CompanyAddress = ({localCompany, updateAddress, updateAddressLoading}) => {
    const mobile = useMobileSize();


    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION) && !localCompany.deleted;

    const city = UseFieldValidation();
    const street = UseFieldValidation();
    const postalCode = UseFieldValidation();
    const streetNumber = UseFieldValidation();

    const isFormValid = UseFormValidation([city, street, postalCode, streetNumber]);

    useEffect(() => {
        if (localCompany) {
            city.setValue(localCompany.city)
            street.setValue(localCompany.street)
            postalCode.setValue(localCompany.postalCode)
            streetNumber.setValue(localCompany.streetNumber)
        }
    }, [localCompany])

    return (
        <Card sx={{maxWidth: 640, minWidth: mobile ? 300 : 450, flex: 1, display: "flex"}} color={"primary"}>

            <CardContent style={{flex: 0}}>
                <Typography level={"title-md"}>Adres</Typography>
            </CardContent>
            <Divider/>
            <form style={{display: "flex", flexDirection: "column", flex: 1}} onSubmit={(e) => {
                e.preventDefault()
                updateAddress(city.value, street.value, streetNumber.value, postalCode.value)
            }}>
                <CardContent orientation={"horizontal"} style={{flex: 1}}>
                    <Stack spacing={1} sx={{flex: 1}}>
                        <FormLabel>
                            <Typography level={"title-sm"}>Miasto</Typography>
                        </FormLabel>
                        <FormControl>
                            <InputWithLimit disabled={!canModify}
                                            placeholder={"Miasto"}
                                            value={city.value}
                                            limit={city.limit}
                                            isValid={city.isValid}
                                            onChange={city.handleChange}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Ulica</Typography>
                        </FormLabel>
                        <FormControl>
                            <InputWithLimit disabled={!canModify}
                                            placeholder={"Ulica"}
                                            value={street.value}
                                            limit={street.limit}
                                            isValid={street.isValid}
                                            onChange={street.handleChange}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Numer budynku</Typography>
                        </FormLabel>
                        <FormControl>
                            <InputWithLimit disabled={!canModify}
                                            placeholder={"Numer"}
                                            value={streetNumber.value}
                                            limit={streetNumber.limit}
                                            isValid={streetNumber.isValid}
                                            onChange={streetNumber.handleChange}/>
                        </FormControl>
                        <FormLabel>
                            <Typography level={"title-sm"}>Kod pocztowy</Typography>
                        </FormLabel>
                        <FormControl>
                            <InputWithLimit disabled={!canModify}
                                            placeholder={"Kod pocztowy"}
                                            value={postalCode.value}
                                            limit={postalCode.limit}
                                            isValid={postalCode.isValid}
                                            onChange={postalCode.handleChange}/>
                        </FormControl>
                    </Stack>

                </CardContent>
                {canModify &&
                    <CardActions>
                        <Button loading={updateAddressLoading} type={"submit"} disabled={!isFormValid}>Zapisz</Button>
                    </CardActions>}
            </form>
        </Card>
    )
};

CompanyAddress.propTypes = {
    localCompany: PropTypes.object.isRequired,
    updateAddress: PropTypes.func.isRequired,
    updateAddressLoading: PropTypes.bool.isRequired
}

export default CompanyAddress;