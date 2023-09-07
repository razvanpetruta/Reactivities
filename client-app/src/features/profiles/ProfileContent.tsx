import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";

interface IPaneElement {
    menuItem: string;
    render: () => JSX.Element;
};

interface Props {
    profile: Profile;
};

const ProfileContent = observer(({ profile }: Props): JSX.Element => {
    const panes: IPaneElement[] = [
        {
            menuItem: "About",
            render: (): JSX.Element => <Tab.Pane>About Content</Tab.Pane>
        },
        {
            menuItem: "Photos",
            render: (): JSX.Element => <ProfilePhotos profile={profile} />
        },
        {
            menuItem: "Events",
            render: (): JSX.Element => <Tab.Pane>Events Content</Tab.Pane>
        },
        {
            menuItem: "Followers",
            render: (): JSX.Element => <Tab.Pane>Followers Content</Tab.Pane>
        },
        {
            menuItem: "Following",
            render: (): JSX.Element => <Tab.Pane>Following Content</Tab.Pane>
        }
    ];

    return (
        <Tab
            menu={{
                fluid: true,
                vertical: true
            }}
            menuPosition="right"
            panes={panes}
        />
    );
});

export default ProfileContent;