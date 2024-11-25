import React from 'react';
import {MenuItem, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";
import {useNavigate} from "react-router";
import PropTypes from "prop-types";


const NotificationList = ({notifications}) => {

    const navigate = useNavigate();

    if (notifications.length > 0) {
        return notifications.map(notification => {
            return (
                <MenuItem key={notification.id} onClick={() => {
                    if (notification.journeyId) {
                        navigate(`/secure/journeys/${notification.journeyId}`)
                    }
                }}>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
                        <div >
                            <Typography color={!notification.seen ? "primary" : "neutral"} style={{flex: 1}}
                                        level={!notification.seen ? "title-sm" : "body-sm"}>{notification.text}</Typography>
                            <Typography
                                level={"body-xs"}>{formatLocalDateTime(notification.date)}</Typography>
                        </div>
                    </div>
                </MenuItem>)
        })
    } else {
        return <MenuItem>
            <Typography level={"body-lg"}>Brak powiadomień</Typography>
        </MenuItem>
    }
};

NotificationList.propTypes = {
    notifications: PropTypes.array.isRequired
}

export default NotificationList;
