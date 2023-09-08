import { Tab, TabProps } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import { useStore } from "../../app/stores/store";

interface IPaneElement {
    menuItem: string;
    render: () => JSX.Element;
};

interface Props {
    profile: Profile;
};

const ProfileContent = observer(({ profile }: Props): JSX.Element => {
    const { profileStore } = useStore();

    const panes: IPaneElement[] = [
        {
            menuItem: "About",
            render: (): JSX.Element => <ProfileAbout />
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