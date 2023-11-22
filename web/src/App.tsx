import { Home } from './Home';
import { Profile } from './Profile';

export const DEVELOPER_MODE = false;

export const App = () => {
    // eslint-disable-next-line no-undef
    const path = window.location.pathname;
    const name = path.replace('/', '');

    if (name.length === 0) {
        return <Home />;
    }

    if (!/^([\dA-Za-z-]([\d.A-Za-z-])+\.)+[\dA-Za-z-]+$/.test(name))
        return <div>Invalid ENS name</div>;

    return <Profile name={name} />;
};
