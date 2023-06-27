import { messengerRender, authorizeFormRender } from "./rendering.js";
import createMessageService, { Message } from "./service.js";

const messageService = createMessageService("http://localhost:3000");

function initApplication({ applicationClass, messageService }) {
  const root = document.querySelector(applicationClass);

  function selectUserState(user) {
    if (user) {
      messengerRender(root, messageService);
    } else {
      authorizeFormRender(root, messageService);
    }
  }

  return {
    init: () => {
      selectUserState();
      messageService.init();
      messageService.userSubscription(selectUserState);
    },
  };
}

const application = initApplication({
  applicationClass: ".app",
  messageService,
});

application.init();
