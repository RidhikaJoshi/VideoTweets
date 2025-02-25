import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addComment,
  deleteComment,
  updateComment,
  getCommentById
} from "../controllers/comment.controller.js";

const router = Router(); // this method is used to create a new router object
router.use(verifyJWT);

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").get(getCommentById).delete(deleteComment).patch(updateComment);

export default router;
