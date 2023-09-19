import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import useQuery from "../../app/util/hooks";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import LoginForm from "./LoginForm";
import { observer } from "mobx-react-lite";

const ConfirmEmail = observer((): JSX.Element => {
    const {modalStore} = useStore();
    const email: string = useQuery().get("email") as string;
    const token: string = useQuery().get("token") as string;

    const Status = {
        Verifying: "Verifying",
        Failed: "Failed",
        Success: "Success"
    };

    const [status, setStatus] = useState<string>(Status.Verifying);

    const handleConfirmEmailResend = (): void => {
        agent.Accounts.resendEmailConfirmation(email).then(() => {
            toast.success("Verification email resent - please check your email");
        }).catch(error => console.log(error));
    };

    useEffect(() => {
        console.log("oke");
        agent.Accounts.verifyEmail(token, email).then(() => {
            setStatus(Status.Success);
        }).catch(() => {
            setStatus(Status.Failed);
        });
    }, [Status.Failed, Status.Success, token, email]);

    const getBody = (): JSX.Element | undefined => {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return (
                    <div>
                        <p>Verification failed. You can try resending the link to your email</p>
                        <Button primary onClick={handleConfirmEmailResend} size="huge" content="Resend email" />
                    </div>
                );
            case Status.Success:
                return (
                    <div>
                        <p>Email has been verified - you can now login</p>
                        <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size="huge" content="Login" />
                    </div>
                );
        }
    }

    return (
        <Segment placeholder textAlign="center">
            <Header icon>
                <Icon name="envelope" />
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    );
});

export default ConfirmEmail;