import React from 'react';
import {useCompanyListWithCampaign} from "../../data/CompaniesData";
import {Sheet, Table, Typography} from "@mui/joy";
import LinkWithRouter from "../../utils/LinkWithRouter";
import {useSelector} from "react-redux";
import {useMobileSize} from "../../utils/SizeQuery";

const CompaniesTable = () => {

    const mobile = useMobileSize();
    const {currentCampaign} = useSelector(state => state.campaigns);
    const {companies} = useCompanyListWithCampaign(currentCampaign);

    return (
        <Sheet sx={{
            width: '100%',
            borderRadius: 'sm',
            overflow: 'auto',
            display: "flex",
        }}>
            <Table
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                }}>
                <thead>
                <tr>
                    <th>
                        <Typography>Firma</Typography>
                    </th>
                    <th>
                        <Typography>Obecna akcja</Typography>
                    </th>
                    {!mobile && <th>
                        <Typography>Historia kontaktu</Typography>
                    </th>}
                </tr>
                </thead>
                <tbody>
                {companies && companies.map(company =>
                    <tr key={company.id}>
                        <td>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <LinkWithRouter to={company.id}>{company.name}</LinkWithRouter>
                                <Typography>{company.www}</Typography>
                                <Typography>{company.email}</Typography>
                            </div>
                        </td>
                        <td>{company.currentJourney ? <div>
                                <Typography>{company.currentJourney.contactStatus}</Typography>
                                <Typography>{company.currentJourney.user.name} {company.currentJourney.user.surname}</Typography>
                                <Typography>{company.currentJourney.journeyStart}</Typography>
                            </div>
                            : <Typography>Wolna</Typography>}</td>
                        {!mobile && <td>{company.contactJourneys.map(journey => <Typography key={journey.campaignName}>
                            {journey.campaignName} {journey.status}</Typography>)}</td>}
                    </tr>
                )}
                </tbody>
            </Table>
        </Sheet>
    );
};

export default CompaniesTable;