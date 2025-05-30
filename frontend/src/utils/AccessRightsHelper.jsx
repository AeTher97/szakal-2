import {useSelector} from "react-redux";

export const useAccessRightsHelper = () => {

    const {accessRights} = useSelector(state => state.auth);

    const hasRight = (right) => {
        return !!accessRights.find(accessRight => accessRight === right);
    }

    const hasAnyRights = (...rights) => {
        return false;
    }

    return {hasRight, hasAnyRights}
}