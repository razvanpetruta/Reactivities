import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import ProfileCard from "./ProfileCard";

const ProfileFollowings = observer((): JSX.Element => {
    const { profileStore } = useStore();
    const { profile, followings, loadingFollowings, activeTab } = profileStore;

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated="left"
                        icon="user"
                        content={activeTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map((profile: Profile) => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});

export default ProfileFollowings;