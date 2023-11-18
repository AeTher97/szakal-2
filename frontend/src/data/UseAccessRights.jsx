import {useSelector} from "react-redux";

export const useAccessRights = () => {

    const {accessRights} = useSelector(state => state.auth);

    const hasRight = (right) => {
        return !!accessRights.find(accessRight => accessRight === right);
    }

    const hasAnyRights = (...rights) => {
        return false;
    }

    return {hasRight, hasAnyRights}
}