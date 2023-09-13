import { Fragment } from 'react';
import { Segment, Button, Placeholder } from 'semantic-ui-react';

const placeholderStyle = {
    marginTop: 25
};

const headerSegmentStyle = {
    minHeight: 110
};

const secondarySegmentStyle = {
    minHeight: 70
};

const ActivityListItemPlaceholder = (): JSX.Element => {
    return (
        <>
            <Placeholder fluid style={placeholderStyle}>
                <Segment.Group>
                    <Segment style={headerSegmentStyle}>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </Segment>
                    <Segment secondary style={secondarySegmentStyle} />
                    <Segment clearing>
                        <Button disabled color='blue' floated='right' content='View' />
                    </Segment>
                </Segment.Group>
            </Placeholder>
        </>
    );
};

export default ActivityListItemPlaceholder;