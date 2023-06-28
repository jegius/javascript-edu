import {authorizeFormRender} from "./authorization.js";
import {createUserRenderer} from "./createUserRenderer.js";

export function welcomePageRender(root, userService) {
    const isNeedToCreateUser = userService.isNeedToCreate();

    if (isNeedToCreateUser) {
        createUserRenderer(root, userService);
    } else {
        authorizeFormRender(root, userService);
    }
}