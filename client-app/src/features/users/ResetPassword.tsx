import { Button, Header, Segment } from "semantic-ui-react";
import { Form, Formik } from "formik";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { observer } from "mobx-react-lite";
import useQuery from "../../app/util/hooks";
import * as Yup from "yup";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import LoginForm from "./LoginForm";
import { useStore } from "../../app/stores/store";
import { Navigate, useLocation } from "react-router-dom";

const inputStyle = {
    width: "50%",
    marginBottom: 10
};

const ResetPassword = observer((): JSX.Element => {
    const { modalStore } = useStore();
    const email: string = useQuery().get("email") as string;
    const token: string = useQuery().get("token") as string;
    const { userStore: { isLoggedIn } } = useStore();
    const location = useLocation();

    if (isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    return (
        <Segment>
            <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={Yup.object({
                    password: Yup.string()
                        .required("Password is required")
                        .test(
                            "complex-password",
                            "Password must be at least 4 characters long",
                            (value) => value.length >= 4
                        )
                        .test(
                            "uppercase",
                            "Password must contain at least one uppercase letter",
                            (value) => /[A-Z]/.test(value)
                        )
                        .test(
                            "lowercase",
                            "Password must contain at least one lowercase letter",
                            (value) => /[a-z]/.test(value)
                        )
                        .test(
                            "digit",
                            "Password must contain at least one digit",
                            (value) => /\d/.test(value)
                        ),
                    confirmPassword: Yup.string()
                        .required("Confirm Password is required")
                        .oneOf([Yup.ref("password")], "Passwords must match")
                })}
                onSubmit={(values) => agent.Accounts.resetPassword(token, email, values.password)
                    .then(() => {
                        toast.success("Password successfully updated - you can now login");
                        modalStore.openModal(<LoginForm />);
                    })}
            >
                {({ handleSubmit, isSubmitting, dirty, isValid }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <Header as={"h2"} content="Reset Your Password" color="teal" />
                        <p>Enter your new password below.</p>
                        <div style={inputStyle}>
                            <CustomTextInput
                                placeholder="New Password"
                                name="password"
                                type="password"
                            />
                        </div>
                        <div style={inputStyle}>
                            <CustomTextInput
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                type="password"
                            />
                        </div>
                        <Button
                            loading={isSubmitting}
                            primary
                            content="Reset Password"
                            type="submit"
                            disabled={isSubmitting || !dirty || !isValid}
                        />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});

export default ResetPassword;