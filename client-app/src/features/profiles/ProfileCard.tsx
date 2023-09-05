import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

const cardStyle = {
    width: "15rem"
};

interface Props {
    profile: Profile;
};

const ProfileCard = observer(({ profile }: Props): JSX.Element => {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`} style={cardStyle}>
            <Image src={profile.image ?? "/assets/user.png"} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user" />
                20 followers
            </Card.Content>
        </Card>
    );
});

export default ProfileCard;