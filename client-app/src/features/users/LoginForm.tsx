import { ErrorMessage, Form, Formik } from "formik";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { Button, Header, Label, Image, Icon, Grid } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";

const imageStyle = {
    height: 80,
    margin: "auto"
};

const gridStyle = {
    marginBottom: 9
};

const iconStyle = {
    marginLeft: -16,
    marginBottom: -3
};

const labelStyle = {
    marginBottom: 10
};

const LoginForm = observer((): JSX.Element => {
    const { userStore, modalStore } = useStore();
    const [focusedInput, setFocusedInput] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Formik
            initialValues={{ email: "", password: "", error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch((error) => setErrors({
                error: error.response.data
            }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                    <Header as={"h2"} content="Login to Reactivities" color="teal" textAlign="center" />
                    <Image
                        src={focusedInput === "password" && !showPassword ? "/assets/notlooking.png" : "/assets/looking.png"}
                        style={imageStyle}
                    />
                    <CustomTextInput
                        placeholder="Email"
                        name="email"
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput("")}
                    />
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
                            <Grid.Column width={2} verticalAlign="middle" textAlign="left">
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
                        render={() => <Label style={labelStyle} basic color="red" content={errors.error} />}
                    />
                    <Button loading={isSubmitting} positive content="Login" type="submit" fluid />
                    <Link onClick={() => modalStore.closeModal()} to="/account/forgotPassword">Forgot your password?</Link>
                </Form>
            )}
        </Formik>
    );
});

export default LoginForm;