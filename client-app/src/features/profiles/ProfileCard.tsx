import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

const cardStyle = {
    width: "15rem"
};

interface Props {
    profile: Profile;
};

const ProfileCard = observer(({ profile }: Props): JSX.Element => {
    const truncate = (text: string | undefined): string => {
        if (!text)
            return "";

        return text.length > 30 ? text.substring(0, 27) + "..." : text;
    };

    return (
        <Card as={Link} to={`/profiles/${profile.username}`} style={cardStyle}>
            <Image src={profile.image ?? "/assets/user.png"} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncate(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user" />
                {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    );
});

export default ProfileCard;