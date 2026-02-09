import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const authRouter = express.Router()

// Start Google login
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] })
)

// Google callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const { token } = req.user;

    res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${token}`
    )
  }
)



authRouter.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
})


export default authRouter;
