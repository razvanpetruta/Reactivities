import { observer } from "mobx-react-lite";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import { IPhoto, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

const ProfilePhotos = observer((): JSX.Element => {
    const [addPhotoMode, setAddPhotoMode] = useState<boolean>(false);
    const [target, setTarget] = useState<string>("");
    const { profileStore: { profile, isCurrentUser, uploadPhoto, deletePhoto, uploading, loading, setMainPhoto }, activityStore: { loadActivities } } = useStore();

    const handlePhotoUpload = (file: Blob): void => {
        uploadPhoto(file).then(() => {
            setAddPhotoMode(false);
            loadActivities();
        });
    };

    const handleSetMainPhoto = async (photo: IPhoto, event: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(event.currentTarget.name);
        setMainPhoto(photo).then(() => loadActivities());
    };

    const handleDeletePhoto = (photo: IPhoto, event: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(event.currentTarget.name);
        deletePhoto(photo);
    };

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="image" content="Photos" />
                    {isCurrentUser &&
                        <Button
                            floated="right"
                            basic
                            content={addPhotoMode ? "Cancel" : "Add Photo"}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile?.photos?.map((photo: IPhoto) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser &&
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color="green"
                                                content="Main"
                                                name={`main${photo.id}`}
                                                disabled={photo.isMain}
                                                loading={target === `main${photo.id}` && loading}
                                                onClick={(event: SyntheticEvent<HTMLButtonElement>) => handleSetMainPhoto(photo, event)}
                                            />
                                            <Button
                                                basic
                                                color="red"
                                                icon="trash"
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={target === photo.id && loading}
                                                onClick={(event: SyntheticEvent<HTMLButtonElement>) => handleDeletePhoto(photo, event)}
                                            />
                                        </Button.Group>
                                    }
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    );
});

export default ProfilePhotos;