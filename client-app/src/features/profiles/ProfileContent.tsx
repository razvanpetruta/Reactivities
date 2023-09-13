import { Tab, TabProps } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";
import ProfileActivities from "./ProfileActivities";

interface IPaneElement {
    menuItem: string;
    render: () => JSX.Element;
};

const ProfileContent = observer((): JSX.Element => {
    const { profileStore } = useStore();

    const panes: IPaneElement[] = [
        {
            menuItem: "About",
            render: (): JSX.Element => <ProfileAbout />
        },
        {
            menuItem: "Photos",
            render: (): JSX.Element => <ProfilePhotos />
        },
        {
            menuItem: "Events",
            render: (): JSX.Element => <ProfileActivities />
        },
        {
            menuItem: "Followers",
            render: (): JSX.Element => <ProfileFollowings />
        },
        {
            menuItem: "Following",
            render: (): JSX.Element => <ProfileFollowings />
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
            onTabChange={(_event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => 
                profileStore.setActiveTab(data.activeIndex as number)}
        />
    );
});

export default ProfileContent;