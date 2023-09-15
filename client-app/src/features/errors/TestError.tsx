import { useState } from 'react';
import { Button, Header, Segment } from "semantic-ui-react";
import axios from 'axios';
import ValidationError from './ValidationError';

const TestErrors = (): JSX.Element => {
    const [errors, setErrors] = useState<string[]>([]);

    const handleNotFound = (): void => {
        axios.get('/buggy/not-found').catch(err => console.log(err.response));
    };

    const handleBadRequest = (): void => {
        axios.get('/buggy/bad-request').catch(err => console.log(err.response));
    };

    const handleServerError = (): void => {
        axios.get('/buggy/server-error').catch(err => console.log(err.response));
    };

    const handleUnauthorised = (): void => {
        axios.get('/buggy/unauthorised').catch(err => console.log(err.response));
    };

    const handleBadGuid = (): void => {
        axios.get('/activities/notaguid').catch(err => console.log(err.response));
    };

    const handleValidationError = (): void => {
        axios.post('/activities', {}).catch(err => setErrors(err));
    };

    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors.length > 0 && <ValidationError errors={errors} />}
        </>
    );
};

export default TestErrors;