import { observer } from "mobx-react-lite";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

const imageStyle = {
    borderColor: "orange",
    borderWidth: 3
};

interface Props {
    attendees: Profile[];
}

const ActivityListItemAttendee = observer(({ attendees }: Props): JSX.Element => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image
                                size="mini"
                                circular
                                src={attendee.image ?? "/assets/user.png"}
                                bordered
                                style={attendee.following ? imageStyle : null}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    );
});

export default ActivityListItemAttendee;