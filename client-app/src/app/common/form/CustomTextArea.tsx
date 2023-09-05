import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
};

const CustomTextArea = (props: Props): JSX.Element => {
    const [field, meta] = useField(props.name);

    return (
        <Form.Field error={meta.touched && meta.error !== undefined}>
            <label>{props.label}</label>
            <textarea {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default CustomTextArea;