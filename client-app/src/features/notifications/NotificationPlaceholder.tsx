import { Divider, Placeholder } from "semantic-ui-react";

const NotificationPlaceholder = (): JSX.Element => {
    return (
        <>
            <Divider />
            <Placeholder fluid style={{ marginLeft: 10 }}>
                <Placeholder.Header image>
                    <Placeholder.Line length="short" />
                    <Placeholder.Line length="very long" />
                </Placeholder.Header>
            </Placeholder>
        </>
    );
}

export default NotificationPlaceholder;