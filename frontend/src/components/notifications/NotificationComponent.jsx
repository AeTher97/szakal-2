import {Badge, Dropdown, Menu, MenuButton, MenuItem} from "@mui/joy";
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
            <MenuButton sx={{border: "none"}}>
                {newNotifications ?
                    <Badge color={"danger"}>
                            <NotificationsIcon/>
                        </Badge> :
                    <NotificationsIcon/>}
            </MenuButton>
            <Menu>
                <NotificationList notifications={notifications}/>
                <MenuItem onClick={handleClose}>
                    <Link>Zamknij</Link>
                </MenuItem>
            </Menu>
        </Dropdown>
    );
};

export default NotificationComponent;