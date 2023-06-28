import {messengerRender} from "./views/message.js";
import {messageService} from "./services/messageService.js";
import {userService} from "./services/userService.js";
import {welcomePageRender} from "./views/welcomeScreen.js";


export const application = (function({applicationClass = '', messageService, userService}) {
    const root = document.querySelector(applicationClass);

    function selectUserState(user) {
        if(user) {
            messengerRender(root, messageService, userService);
        } else {
            welcomePageRender(root, userService);
        }
    }

    return {
        init: () => {
            selectUserState();
            messageService.init();
            userService.init();
            userService.subscribeOnUserState(selectUserState)
        },
    }
})({applicationClass: '.app', messageService, userService})