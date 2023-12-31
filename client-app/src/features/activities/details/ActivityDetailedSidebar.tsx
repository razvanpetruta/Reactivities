import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Activity } from '../../../app/models/activity'

const segmentStyle = {
    border: 'none'
};

interface Props {
    activity: Activity;
}

const ActivityDetailedSidebar = observer(({ activity: { attendees, host } }: Props): JSX.Element | null => {
    if (!attendees)
        return null;

    return (
        <>
            <Segment
                textAlign='center'
                style={segmentStyle}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? "Person" : "People"} Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(attendee => (
                        <Item style={{ position: 'relative' }} key={attendee.username}>
                            {attendee.username === host?.username &&
                                <Label
                                    style={{ position: 'absolute' }}
                                    color='orange'
                                    ribbon='right'
                                >
                                    Host
                                </Label>
                            }
                            <Image size='tiny' src={attendee.image ?? '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profiles/${attendee.username}`}>{attendee.displayName}</Link>
                                </Item.Header>
                                {attendee.following && 
                                    <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                                }
                            </Item.Content>
                        </Item>
                    ))}
                </List>
            </Segment>
        </>
    );
});

export default ActivityDetailedSidebar;