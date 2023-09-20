import { Button, Header, Icon, Message, Segment } from "semantic-ui-react";
import { Form, Formik } from "formik";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { observer } from "mobx-react-lite";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { useStore } from "../../app/stores/store";
import { Navigate, useLocation } from "react-router-dom";

const inputStyle = {
    width: "50%",
    marginBottom: 10
};

const ForgotPassword = observer((): JSX.Element => {
    const { userStore: { isLoggedIn } } = useStore();
    const location = useLocation();

    if (isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    return (
        <Segment>
            <Formik
                initialValues={{ email: "" }}
                onSubmit={(values) => agent.Accounts.forgotPassword(values.email)
                    .then(() => toast.success(`Reset password email successfully sent to ${values.email}`))}
            >
                {({ handleSubmit, isSubmitting }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <Header as={"h2"} content="Forgot Your Password?" color="teal" />
                        <p>Enter your email address below to receive a password reset link.</p>
                        <div style={inputStyle}>
                            <CustomTextInput
                                placeholder="Email"
                                name="email"
                            />
                        </div>
                        <Button loading={isSubmitting} primary content="Send" type="submit" />
                    </Form>
                )}
            </Formik>
            <Message warning>
                <Icon name='warning' />
                It might take a few minutes to receive the email...
            </Message>
        </Segment>
    );
});

export default ForgotPassword;