import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  changeCurrentPassword,
  refreshAccessToken,
  logoutUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router(); // this method is used to create a new router object

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("/changeCurrentPassword").post(verifyJWT, changeCurrentPassword);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/updateAccountDetails").post(verifyJWT, updateAccountDetails);
router
  .route("/ updateUserAvatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/updateUserCoverImage")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default router;
