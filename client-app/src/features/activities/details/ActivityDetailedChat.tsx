import { observer } from 'mobx-react-lite';
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { IChatComment } from '../../../app/models/comment';
import { Link } from 'react-router-dom';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from "yup";
import { formatDistanceToNow } from 'date-fns';

const segmentStyle = {
    border: 'none'
};

const fieldDivStyle = {
    position: "relative" as "relative"
};

const commentTextStyle = {
    whiteSpace: "pre-wrap" as "pre-wrap"
};

interface Props {
    activityId: string;
};

const ActivityDetailedChat = observer(({ activityId }: Props): JSX.Element => {
    const { commentStore } = useStore();

    useEffect(() => {
        if (!activityId)
            return;

        commentStore.createHubConnection(activityId);

        return () => {
            commentStore.clearComments();
        };
    }, [commentStore, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={segmentStyle}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    initialValues={{ body: "" }}
                    validationSchema={
                        Yup.object({
                            body: Yup.string().required()
                        })
                    }
                    onSubmit={(values, { resetForm }) =>
                        commentStore.addComment(values).then(() => resetForm())}
                >
                    {({ isSubmitting, isValid, handleSubmit }) => (
                        <Form className='ui form'>
                            <Field name="body">
                                {(props: FieldProps) => (
                                    <div style={fieldDivStyle}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                            rows={2}
                                            {...props.field}
                                            onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                                if (event.key === "Enter" && event.shiftKey) {
                                                    return;
                                                }

                                                if (event.key === "Enter" && !event.shiftKey) {
                                                    event.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>

                <Comment.Group>
                    {commentStore.comments.map((comment: IChatComment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image ?? '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{comment.createdAt && formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={commentTextStyle}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>
    );
});

export default ActivityDetailedChat;