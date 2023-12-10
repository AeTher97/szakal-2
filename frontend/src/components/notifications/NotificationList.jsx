import React from 'react';
import {MenuItem, Typography} from "@mui/joy";
import {formatLocalDateTime} from "../../utils/DateUtils";


const NotificationList = ({notifications}) => {


    if (notifications.length > 0) {
        return notifications.map(notification => {
            return (
                <MenuItem key={notification.id}>
                    <div style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
                        <div >
                            <Typography color={"primary"} style={{flex: 1}}
                                        level={"body-lg"}>{notification.text}</Typography>
                            <Typography
                                level={"body-sm"}>{formatLocalDateTime(notification.date)}</Typography>
                        </div>
                    </div>
                </MenuItem>)
        })
    } else {
        return <MenuItem>
            <Typography level={"body-lg"}>Brak powiadomien</Typography>
        </MenuItem>
    }


};

export default NotificationList;
