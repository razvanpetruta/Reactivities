import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

const labelStyle = {
    textAlign: "center"
};

const itemImageStyle = {
    marginBottom: 5
};

interface Props {
    activity: Activity;
}

const ActivityListItem = ({ activity }: Props): JSX.Element => {
    return (
        <Segment.Group>
            <Segment>
                {activity.isCanceled &&
                    <Label attached="top" color="red" content="Cancelled" style={labelStyle} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={itemImageStyle} size="tiny" circular src={activity.host?.image ?? "/assets/user.png"} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>
                                Hosted by
                                <Link to={`/profiles/${activity.hostUsername}`}>
                                    {` ${activity.host?.displayName}`}
                                </Link>
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy HH:mm")}
                    <br />
                    <Icon name="marker" /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>
                    {activity.description}
                    <Button
                        as={Link}
                        to={`/activities/${activity.id}`}
                        color="teal"
                        floated="right"
                        content="View"
                    />
                </span>
            </Segment>
        </Segment.Group>
    );
};

export default ActivityListItem;