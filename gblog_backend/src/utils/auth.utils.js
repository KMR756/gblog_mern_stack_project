// auth.utils.js
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/",
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 *60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 *24 * 60 * 60 * 1000,
  });
};

export const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || "",
  createdAt: user.createdAt,
});

export const clearAuthCookies = (res) => {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);
};
