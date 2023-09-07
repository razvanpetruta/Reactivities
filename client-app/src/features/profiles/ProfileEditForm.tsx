import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import CustomTextInput from "../../app/common/form/CustomTextInput";
import CustomTextArea from "../../app/common/form/CustomTextArea";
import { Button } from "semantic-ui-react";

interface Props {
    setEditMode: (editMode: boolean) => void;
};

const ProfileEditForm = observer(({ setEditMode }: Props): JSX.Element => {
    const { profileStore: { profile, updateProfile } } = useStore();

    return (
        <Formik
            initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
            onSubmit={values => {
                updateProfile(values).then(() => {
                    setEditMode(false);
                });
            }}
            validationSchema={
                Yup.object({
                    displayName: Yup.string().required()
                })}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="ui form">
                    <CustomTextInput placeholder="Display Name" name="displayName" />
                    <CustomTextArea rows={3} placeholder="Edit you bio" name="bio" />
                    <Button
                        positive
                        type="submit"
                        loading={isSubmitting}
                        content="Update profile"
                        floated="right"
                        disabled={!isValid || !dirty || isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    );
});

export default ProfileEditForm;