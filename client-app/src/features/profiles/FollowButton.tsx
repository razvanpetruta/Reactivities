import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";

const contentStyle = {
    width: "100%"
};

interface Props {
    profile: Profile;
};

const FollowButton = observer(({ profile }: Props): JSX.Element | null => {
    const { profileStore, userStore } = useStore();
    const { updateFollowing, loading } = profileStore;

    if (userStore.user?.username === profile.username)
        return null;

    const handleFollow = (event: SyntheticEvent, username: string): void => {
        event.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    };

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={contentStyle}>
                <Button fluid color="teal" content={profile.following ? "Following" : "Not following"} />
            </Reveal.Content>
            <Reveal.Content hidden style={contentStyle}>
                <Button
                    loading={loading}
                    fluid
                    basic
                    color={profile.following ? "red" : "green"}
                    content={profile.following ? "Unfollow" : "Follow"}
                    onClick={(event: SyntheticEvent) => handleFollow(event, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    );
});

export default FollowButton;