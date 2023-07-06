authorize: (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user with the submitted username
    const user = users.find((u) => u.name === username);

    // If user not found or password doesn't match, return error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(404).send("Incorrect username or password");
    }

    // Return user with id and name
    const authorizedUser = { id: user.id, name: user.name };
    res.status(200).send(authorizedUser);
  } catch (error) {
    console.error("Error authorizing user:", error);
    res.status(500).send("Internal server error");
  }
};
