// Import the bcryptjs library
import { genSaltSync, hashSync } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// User controller
const userController = {
  createUser: (req, res) => {
    try {
      const { user } = req.body;

      // Check if user with the submitted name already exists
      const existingUser = users.find((u) => u.name === user.name);
      if (existingUser) {
        return res.status(400).send("User with the same name already exists");
      }

      // Encrypt the password before saving the user
      const salt = genSaltSync(10);
      const encryptedPassword = hashSync(user.password, salt);
      user.password = encryptedPassword;

      // Generate a unique ID for the user
      const userId = uuidv4();

      // Assign the unique ID to the user
      user.id = userId;

      user.push(user);
      res.status(200).send(users);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Internal server error");
    }
  },

  getUsers: (req, res) => {
    res.json(users);
  },
};
export default userController;
