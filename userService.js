// userService.js
export const userService = (function (serverAddress) {
  let isNeedToCreate = false;
  const currentUserData = {};

  return {
    getCurrentUser: () => {},
    createUser: () => {},
    isNeedToCreate: () => isNeedToCreate,
    setIsNeedToCreate: (value) => {
      isNeedToCreate = value;
    },
    authorize: (user) => {
      if (isNeedToCreate) {
        // Logic for user creation form
        const password = document.querySelector(".user-password").value;
        const confirmPassword = document.querySelector(
          ".user-password-confirm"
        ).value;

        if (password !== confirmPassword) {
          // Password and confirmation do not match
          alert(
            "The password and password confirmation do not match, please try again."
          );
          return;
        }

        // Handle user creation
        console.log("User creation logic");
      } else {
        // Logic for authorization form
        console.log("Authorization logic");
      }
    },
    subscribeOnUserState: (callback) => {},
  };
})(API_URL);
