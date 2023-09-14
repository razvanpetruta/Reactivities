import { Message } from "semantic-ui-react";

interface Props {
    errors: string[];
}

const ValidationError = ({ errors }: Props): JSX.Element => {
    return (
        <Message error>
            {errors &&
                <Message.List>
                    {errors.map((error: string, index: number) => (
                        <Message.Item key={index}>
                            {error}
                        </Message.Item>
                    ))}
                </Message.List>
            }
        </Message>
    );
};

export default ValidationError;