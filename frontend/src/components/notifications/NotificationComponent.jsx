import {Badge, Dropdown, Menu, MenuButton, MenuItem, Tooltip, Typography} from "@mui/joy";
import Link from "@mui/joy/Link";
import {useNotificationList} from "../../data/NotificationData";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationList from "./NotificationList";


const NotificationComponent = () => {

    const {newNotifications, notifications, markNotificationAsSeen} = useNotificationList();

    const handleClose = () => {
        markNotificationAsSeen(notifications.map(notification => notification.id) || []);
    };

    return (
        <Dropdown onOpenChange={(event, isOpen) => {
            if (!isOpen) {
                handleClose();
            }
        }}>
            <MenuButton sx={{border: "none", paddingLeft: "8px", paddingRight: "8px"}}>
                <Tooltip title={"Powiadomienia"}>
                    {newNotifications ?
                        <Badge color={"danger"}>
                            <NotificationsIcon/>
                        </Badge> :
                        <NotificationsIcon/>}
                </Tooltip>
            </MenuButton>
            <Menu style={{maxHeight: 800, overflowY: "scroll"}}>
                <NotificationList notifications={notifications}/>
                <MenuItem onClick={handleClose}>
                    <Link><Typography level={"body-sm"} color={"primary"}>Zamknij</Typography></Link>
                </MenuItem>
            </Menu>
        </Dropdown>
    );
};

export default NotificationComponent;