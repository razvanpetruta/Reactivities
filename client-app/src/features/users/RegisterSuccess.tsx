import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import useQuery from "../../app/util/hooks";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const RegisterSuccess = (): JSX.Element => {
    const email: string = useQuery().get("email") as string;

    const handleConfirmEmailResend = (): void => {
        agent.Accounts.resendEmailConfirmation(email).then(() => {
            toast.success("Verification email resent - please check your email");
        }).catch(error => console.log(error));
    };

    return (
        <Segment placeholder textAlign="center">
            <Header icon color="green" >
                <Icon name="check" />
            </Header>
            <p>Please check email (including junk email) for the verification link</p>
            {email &&
                <>
                    <p>Didn't receive the email? Click the below button to resend</p>
                    <Button primary onClick={handleConfirmEmailResend} content="Resend email" size="huge" />
                </>
            }
        </Segment>
    );
};

export default RegisterSuccess;