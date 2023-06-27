import {messengerRender} from "./views/message.js";
import {messageService} from "./services/messageService.js";
import {authorizeFormRender} from "./views/authorization.js";


export const application = (function({applicationClass = '', messageService}) {
    const root = document.querySelector(applicationClass);

    function selectUserState(user) {
        if(user) {
            messengerRender(root, messageService);
        } else {
            authorizeFormRender(root, messageService);
        }
    }

    return {
        init: () => {
            selectUserState();
            messageService.init();

            messageService.userSubscription(selectUserState)
        },
    }
})({applicationClass: '.app', messageService})