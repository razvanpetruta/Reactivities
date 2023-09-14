import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";

const cropperStyle = {
    height: 200,
    width: "100%"
};

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

const PhotoWidgetCropper = ({ imagePreview, setCropper }: Props): JSX.Element => {
    return (
        <Cropper
            src={imagePreview}
            style={cropperStyle}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            autoCropArea={1}
            background={false}
            onInitialized={(cropper: Cropper) => setCropper(cropper)}
        />
    );
};

export default PhotoWidgetCropper;