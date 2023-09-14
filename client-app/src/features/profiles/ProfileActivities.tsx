import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useEffect } from "react";
import { Card, Grid, Header, Tab, TabProps, Image } from "semantic-ui-react";
import { IUserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const imageStyle = {
    minHeight: 100,
    objectFit: "cover"
};

interface IPaneElement {
    menuItem: string;
    pane: {
        key: string;
    };
}

const panes: IPaneElement[] = [
    {
        menuItem: "Future Events",
        pane: {
            key: "future"
        }
    },
    {
        menuItem: "Past Events",
        pane: {
            key: "past"
        }
    },
    {
        menuItem: "Hosting",
        pane: {
            key: "hosting"
        }
    }
];

const ProfileActivities = observer((): JSX.Element => {
    const { profileStore } = useStore();
    const { loadUserActivities, profile, loadingActivities, userActivities } = profileStore;

    useEffect(() => {
        if (profile === null)
            return;

        loadUserActivities(profile.username, "future");
    }, [loadUserActivities, profile]);

    const handleTabChange = (_event: SyntheticEvent, data: TabProps): void => {
        loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key)
    };

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="calendar" content="Activities" />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(event: SyntheticEvent, data: TabProps) => handleTabChange(event, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map((activity: IUserActivity) => (
                            <Card
                                as={Link}
                                to={`/activities/${activity.id}`}
                                key={activity.id}
                            >
                                <Image 
                                    src={`/assets/categoryImages/${activity.category}.jpg`}
                                    style={imageStyle}
                                />
                                <Card.Content>
                                    <Card.Header textAlign="center">{activity.title}</Card.Header>
                                    <Card.Meta textAlign="center">
                                        <div>{format(new Date(activity.date), "do LLL y")}</div>
                                        <div>{format(new Date(activity.date), "HH:mm")}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});

export default ProfileActivities;