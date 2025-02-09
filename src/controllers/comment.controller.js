import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { valkey } from "../app.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid video Id for fetching all comments");
  }
  const comment = await Comment.find({ video: videoId })
    .skip((page - 1) * limit)
    .limit(limit);
  if (!comment) {
    throw new ApiError(404, "No Comments Found for the video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comments Fetched Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { commentContent } = req.body;

  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "VideoId is incorrect");
  }
  if (!commentContent) {
    throw new ApiError(400, "Content is Missing in Comment");
  }
  const comment = await Comment.create({
    content: commentContent,
    video: videoId,
    owner: req.user._id,
  });
  if (!comment) {
    throw new ApiError(
      500,
      "Internal Server Error Occurred while creating comment"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const validity = isValidObjectId(commentId);
  if (!validity) {
    throw new ApiError(400, "Invalid Comment Id");
  }
  // check if the comment is present in the redis server or not
  // if present delete the comment from the redis server
  // and update the comment in the database
  const commentCached= await valkey.get(commentId);
  if(commentCached){
    await valkey.del(commentId);
  }
  const { updateContent } = req.body;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment is not present in the database");
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: updateContent,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedComment) {
    throw new ApiError(
      500,
      "Internal Server error Occurred while updating the comment"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment Updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const validity = isValidObjectId(commentId);
  if (!validity) {
    throw new ApiError(400, "Invalid Comment Id for deleting a comment");
  }
  // check if the comment is present in the redis server or not
  // if present delete the comment from the redis server
  // and delete the comment from the database
  const commentCached= await valkey.get(commentId);
  if(commentCached){
    await valkey.del(commentId);
  }
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new ApiError(
      500,
      "Internal Server error occurred while dleting a specific comment"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully"));
});

const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const validity = isValidObjectId(commentId);
  if (!validity) {
    throw new ApiError(400, "Invalid Comment Id for fetching a comment");
  }
  // check if the comment is present in the redis server or not
  // if present return the comment from the redis server
  // else fetch the comment from the database and store it in the redis server

  const commentCached= await valkey.get(commentId);
  if(commentCached){
    return res
    .status(200)
    .json(new ApiResponse(200, JSON.parse(commentCached), "Comment Fetched Successfully"));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "No Comment Found for the given Id");
  }

  // store the comment in the redis server
  await valkey.set(commentId, JSON.stringify(comment));
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment Fetched Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment,getCommentById };
