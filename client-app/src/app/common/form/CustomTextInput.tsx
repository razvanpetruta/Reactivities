import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const CustomTextInput = (props: Props): JSX.Element => {
    const [field, meta, helpers] = useField(props.name);

    const handleFocus = () => {
        if (props.onFocus) {
            props.onFocus();
        }
        helpers.setTouched(false);
    };

    const handleBlur = () => {
        if (props.onBlur) {
            props.onBlur();
        }
        helpers.setTouched(true);
    };

    return (
        <Form.Field error={meta.touched && meta.error !== undefined}>
            <label>{props.label}</label>
            <input
                {...field}
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default CustomTextInput;
