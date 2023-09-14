import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    options: {
        text: string;
        value: string;
    }[];
    label?: string;
}

const CustomSelectInput = (props: Props): JSX.Element => {
    const [field, meta, helpers] = useField(props.name);

    return (
        <Form.Field error={meta.touched && meta.error !== undefined}>
            <label>{props.label}</label>
            <Select
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(_event, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default CustomSelectInput;