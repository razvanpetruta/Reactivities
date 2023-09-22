import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Divider, Feed, Grid, Icon, Menu, Sidebar } from "semantic-ui-react";
import { INotification, Type } from "../../app/models/notification";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "../../app/stores/store";
import NotificationPlaceholder from "./NotificationPlaceholder";

const gridStyle = {
    margin: 0
};

const gridRowStyle = {
    padding: 0
};

const paragraphStyle = {
    float: "left" as const,
    fontWeight: "bold"
};

const iconStyle = {
    float: "right",
    cursor: "pointer"
};

const aStyle = {
    float: "right" as const,
    cursor: "pointer"
};

interface Props {
    sidebarVisible: boolean;
    toggleSidebar: () => void;
}

const NotificationsSidebar = observer(({ sidebarVisible, toggleSidebar }: Props): JSX.Element => {
    const { userStore: { user, getLatestNotifications, loadingNotifications } } = useStore();

    const handleCheckForUpdates = (): void => {
        getLatestNotifications();
    };

    const renderFeedElement = (notification: INotification): JSX.Element | null => {
        switch (notification.type) {
            case Type.StartedFollowing:
                return (
                    <Fragment key={notification.id}>
                        <Divider />
                        <Feed.Event>
                            <Feed.Label>
                                <Icon name='user plus' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Date>{notification.date && formatDistanceToNow(notification.date)}</Feed.Date>
                                <Feed.Summary>
                                    <Link to={`/profiles/${notification.senderUsername}`}>{notification.senderDisplayName}</Link> started following you
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Fragment>
                );
            case Type.JoinedActivity:
                return (
                    <Fragment key={notification.id}>
                        <Divider />
                        <Feed.Event>
                            <Feed.Label>
                                <Icon name='calendar' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Date>{notification.date && formatDistanceToNow(notification.date)}</Feed.Date>
                                <Feed.Summary>
                                    <Link to={`/profiles/${notification.senderUsername}`}>{notification.senderDisplayName}</Link> joined your <Link to={`/activities/${notification.activityId}`}>activity</Link>
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Fragment>
                );
            case Type.LeftActivity:
                return (
                    <Fragment key={notification.id}>
                        <Divider />
                        <Feed.Event>
                            <Feed.Label>
                                <Icon name='calendar' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Date>{notification.date && formatDistanceToNow(notification.date)}</Feed.Date>
                                <Feed.Summary>
                                    <Link to={`/profiles/${notification.senderUsername}`}>{notification.senderDisplayName}</Link> left your <Link to={`/activities/${notification.activityId}`}>activity</Link>
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Fragment>
                );
            case Type.ActivityHasBeenCanceled:
                return (
                    <Fragment key={notification.id}>
                        <Divider />
                        <Feed.Event>
                            <Feed.Label>
                                <Icon name='calendar' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Date>{notification.date && formatDistanceToNow(notification.date)}</Feed.Date>
                                <Feed.Summary>
                                    <Link to={`/profiles/${notification.senderUsername}`}>{notification.senderDisplayName}</Link> has canceled an <Link to={`/activities/${notification.activityId}`}>activity</Link> you are joining
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Fragment>
                );
            case Type.ActivityHasBeenReactivated:
                return (
                    <Fragment key={notification.id}>
                        <Divider />
                        <Feed.Event>
                            <Feed.Label>
                                <Icon name='calendar' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Date>{notification.date && formatDistanceToNow(notification.date)}</Feed.Date>
                                <Feed.Summary>
                                    <Link to={`/profiles/${notification.senderUsername}`}>{notification.senderDisplayName}</Link> has reactivated an <Link to={`/activities/${notification.activityId}`}>activity</Link> you are joining
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Fragment>
                );
            default:
                return null;
        }
    };

    return (
        <Sidebar
            as={Menu}
            animation="overlay"
            direction="right"
            icon='labeled'
            vertical
            visible={sidebarVisible}
            width="wide"
        >
            <Grid style={gridStyle}>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <p style={paragraphStyle}>Notifications</p>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Icon name="close" onClick={toggleSidebar} style={iconStyle} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={gridRowStyle}>
                    <Grid.Column width={16}>
                        <a style={aStyle} onClick={handleCheckForUpdates}>Check for updates</a>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Feed>
                {!loadingNotifications && user && user.notifications.map((notification: INotification) => (
                    renderFeedElement(notification)
                ))}
                {loadingNotifications &&
                    <>
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                        <NotificationPlaceholder />
                    </>
                }
            </Feed>
        </Sidebar>
    );
});

export default NotificationsSidebar;