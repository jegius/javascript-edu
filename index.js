// index.js

// Import the necessary modules
import authorizeFormRender from "./authorizeFormRender.js";
import { initializeUserService } from "./userService.js";
import { initializeUserController } from "./userController.js";

// Run the code to render the authorization form
const root = document.getElementById("root");
const userService = initializeUserService(); // Assuming we have a function to initialize the userService
authorizeFormRender(root, userService);

// Initialize the user controller
initializeUserController(userService);
