import { ErrorMessage, Form, Formik } from "formik";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { Button, Grid, Header, Icon, Image } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import ValidationError from "../errors/ValidationError";
import { useState } from "react";

const imageStyle = {
    height: 80,
    margin: "auto"
};

const gridStyle = {
    marginBottom: 9
};

const iconStyle = {
    marginLeft: -16,
    marginTop: 9
};


const RegisterForm = observer((): JSX.Element => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [focusedInput, setFocusedInput] = useState<string>("");
    const { userStore } = useStore();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Formik
            initialValues={{ displayName: "", username: "", email: "", password: "", error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({
                error
            }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
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
                    )
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as={"h2"} content="Sign up to Reactivities" color="teal" textAlign="center" />
                    <Image
                        src={focusedInput === "password" && !showPassword ? "/assets/notlooking.png" : "/assets/looking.png"}
                        style={imageStyle}
                    />
                    <CustomTextInput placeholder="Email" name="email" />
                    <CustomTextInput placeholder="Display Name" name="displayName" />
                    <CustomTextInput placeholder="Username" name="username" />
                    <Grid style={gridStyle}>
                        <Grid.Row>
                            <Grid.Column width={14}>
                                <CustomTextInput
                                    placeholder="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    onFocus={() => setFocusedInput("password")}
                                    onBlur={() => setFocusedInput("")}
                                />
                            </Grid.Column>
                            <Grid.Column width={2} textAlign="left">
                                <Icon
                                    name={showPassword ? "eye slash" : "eye"}
                                    link
                                    size="big"
                                    onClick={togglePasswordVisibility}
                                    style={iconStyle}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <ErrorMessage
                        name="error"
                        render={() => <ValidationError errors={[errors.error as string]} />}
                    />
                    <Button
                        loading={isSubmitting}
                        positive
                        content="Register"
                        type="submit"
                        fluid
                        disabled={isSubmitting || !dirty || !isValid}
                    />
                </Form>
            )}
        </Formik>
    );
});

export default RegisterForm;