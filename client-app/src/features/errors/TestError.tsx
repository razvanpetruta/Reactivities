import { useState } from 'react';
import { Button, Header, Segment } from "semantic-ui-react";
import axios from 'axios';
import ValidationError from './ValidationError';

const TestErrors = (): JSX.Element => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const [errors, setErrors] = useState<string[]>([]);

    const handleNotFound = (): void => {
        axios.get(baseUrl + '/buggy/not-found').catch(err => console.log(err.response));
    };

    const handleBadRequest = (): void => {
        axios.get(baseUrl + '/buggy/bad-request').catch(err => console.log(err.response));
    };

    const handleServerError = (): void => {
        axios.get(baseUrl + '/buggy/server-error').catch(err => console.log(err.response));
    };

    const handleUnauthorised = (): void => {
        axios.get(baseUrl + '/buggy/unauthorised').catch(err => console.log(err.response));
    };

    const handleBadGuid = (): void => {
        axios.get(baseUrl + '/activities/notaguid').catch(err => console.log(err.response));
    };

    const handleValidationError = (): void => {
        axios.post(baseUrl + '/activities', {}).catch(err => setErrors(err));
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