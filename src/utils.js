import { NavLink, useLocation } from "react-router-dom";

function QueryNavLink({ to, ...props }) {
    let location = useLocation();
    return <NavLink to={to + location.search} {...props} />;
}

export { QueryNavLink }