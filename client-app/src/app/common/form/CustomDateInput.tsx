import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

const CustomDateInput = (props: Partial<ReactDatePickerProps>): JSX.Element => {
    const [field, meta, helpers] = useField(props.name!);

    return (
        <Form.Field error={meta.touched && meta.error !== undefined}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={(value) => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
};

export default CustomDateInput;