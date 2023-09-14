import { ErrorMessage, Form, Formik } from "formik";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

const LoginForm = observer((): JSX.Element => {
    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: "", password: "", error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(() => setErrors({
                error: "Invalid email or password"
            }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                    <Header as={"h2"} content="Login to Reactivities" color="teal" textAlign="center" />
                    <CustomTextInput placeholder="Email" name="email" />
                    <CustomTextInput placeholder="Password" name="password" type="password" />
                    <ErrorMessage
                        name="error"
                        render={() => <Label style={{ marginBottom: 10 }} basic color="red" content={errors.error} />}
                    />
                    <Button loading={isSubmitting} positive content="Login" type="submit" fluid />
                </Form>
            )}
        </Formik>
    );
});

export default LoginForm;