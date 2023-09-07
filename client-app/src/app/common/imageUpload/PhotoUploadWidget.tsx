import { Button, Grid, Header, Image } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

const imgPreviewStyle = {
    minHeight: 200,
    overflow: "hidden"
};

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
};

const PhotoUploadWidget = ({ loading, uploadPhoto }: Props): JSX.Element => {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    const onCrop = (): void => {
        if (!cropper)
            return;

        cropper.getCroppedCanvas().toBlob((blob: Blob | null) => uploadPhoto(blob!));
    };

    useEffect(() => {
        return () => {
            files.forEach((file: object & { preview?: string }) => URL.revokeObjectURL(file.preview!));
        };
    }, [files]);

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 1 - Add Photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 2 - Resize Photo" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step 4 - Preview & Upload" />
                {files && files.length > 0 &&
                    <>
                        <div className="img-preview" style={imgPreviewStyle} />
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon="check" />
                            <Button disabled={loading} onClick={() => setFiles([])} icon="close" />
                        </Button.Group>
                    </>
                }
            </Grid.Column>
        </Grid>
    );
};

export default PhotoUploadWidget;