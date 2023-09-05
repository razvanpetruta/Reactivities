import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

const menuStyles = {
    width: '100%',
    marginTop: 28
};

const ActivityFilters = (): JSX.Element => {
    return (
        <>
            <Menu vertical style={menuStyles}>
                <Header icon='filter' attached color="teal" content="Filters" />
                <Menu.Item content='All Activities' />
                <Menu.Item content="I'm going" />
                <Menu.Item content="I'm hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    );
};

export default ActivityFilters;