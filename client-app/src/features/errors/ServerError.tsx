import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Container, Header, Segment } from "semantic-ui-react";

const codeStyle = {
    marginTop: "10px"
};

const ServerError = observer((): JSX.Element => {
    const { commonStore } = useStore();

    return (
        <Container>
            <Header as={"h1"} content="Server Error" />
            <Header sub as={"h5"} color="red" content={commonStore.error?.message} />
            {commonStore.error?.details &&
                <Segment>
                    <Header as={"h4"} content="Stack Trace" color="teal" />
                    <code style={codeStyle}>{commonStore.error.details}</code>
                </Segment>
            }
        </Container>
    );
});

export default ServerError;