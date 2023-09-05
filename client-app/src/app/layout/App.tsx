import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from "react-toastify";
import ModalContainer from "../common/modals/ModalContainer";

const containerStyle = {
    marginTop: "7rem"
};

function App() {
    const location = useLocation();
    const { commonStore, userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded())
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded)
        return <LoadingComponent content="Loading app..." />

    return (
        <>
            <ModalContainer />
            <ToastContainer position="bottom-right" theme="colored" />
            {location.pathname === '/' ? <HomePage /> : (
                <>
                    <NavBar />
                    <Container style={containerStyle}>
                        <Outlet />
                    </Container>
                </>
            )}
        </>
    );
};

export default observer(App);