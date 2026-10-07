import { loginAdmin } from "../services/auth.service.js";

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await loginAdmin(email, password);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.admin = admin;

    res.json({
      success: true,
      message: "Login successful",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentAdminController(req, res) {
  res.json({
    success: true,
    data: req.session.admin,
  });
}

export function logoutController(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
}