import {API_URL} from "../consts.js";

export const userService = (function (serverAddress) {
    const currentUserData = {};

    return {
        getCurrentUser: () => {},
        createUser: () => {},
        isNeedToCreate: () => {},
        setIsNeedToCreate: () => {},
        authorize: (user) => {
        },
        subscribeOnUserState: (callback) => {}
    }
})(API_URL)