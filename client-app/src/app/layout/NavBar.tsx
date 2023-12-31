import { useState } from "react";
import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import NotificationsSidebar from "../../features/notifications/NotificationsSidebar";

const imageStyle = {
    marginRight: "10px"
};

const NavBar = observer((): JSX.Element => {
    const { userStore: { user, logout, isLoggedIn } } = useStore();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = (): void => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <>
            <Menu inverted fixed="top">
                <Container>
                    <Menu.Item as={NavLink} to={'/'} header>
                        <img
                            src="/assets/logo.png"
                            alt="logo"
                            style={imageStyle}
                        />
                        Reactivities
                    </Menu.Item>
                    {isLoggedIn &&
                        <>
                            <Menu.Item as={NavLink} to={'/activities'} name="Activities" />
                            <Menu.Item as={NavLink} to={'/errors'} name="Errors" />
                            <Menu.Item>
                                <Button as={NavLink} to={'/createActivity'} positive content="Create Activity" />
                            </Menu.Item>
                            <Menu.Item position="right">
                                <Image src={user?.image || "/assets/user.png"} avatar spaced="right" />
                                <Dropdown pointing="top left" text={user?.displayName}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text="My profile" icon="user" />
                                        <Dropdown.Item text="Notifications" icon="inbox" onClick={toggleSidebar} />
                                        <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>

                            <NotificationsSidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
                        </>
                    }
                </Container>
            </Menu>

            
        </>
    );
});

export default NavBar;
