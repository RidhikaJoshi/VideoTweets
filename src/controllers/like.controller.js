import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid Video Id for toggling Like");
  }
  const video = await Like.findOne({ video: videoId, likedBy: req.user._id });
  if (!video) {
    const liked = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!liked) {
      throw new ApiError(
        500,
        "Internal Server error occurred while liking the video"
      );
    }
    return res.status(200).json(new ApiResponse(200, liked, "Video liked"));
  } else {
    const removeLike = await Like.deleteOne({
      video: videoId,
      likedBy: req.user._id,
    });

    if (!removeLike) {
      throw new ApiError(
        500,
        "Internal Server error occurred while removing the like from the video"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, removeLike, "Video like removed"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  const validity = isValidObjectId(commentId);
  if (!validity) {
    throw new ApiError(400, "Invalid comment Id for toggling like on comment");
  }
  const liked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (!liked) {
    const newLiked = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!newLiked) {
      throw new ApiError(
        500,
        "Internal Server error occurred while liking the comment"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, newLiked, "Liked added on Comment Successfully")
      );
  } else {
    const removeLike = await Like.deleteOne({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!removeLike) {
      throw new ApiError(
        500,
        "Internal Server error occurred while removing like"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, removeLike, "Liked removed Successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const validity = isValidObjectId(tweetId);
  if (!validity) {
    throw new ApiError(400, "Invalid TweetId");
  }
  const liked = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });
  if (!liked) {
    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    if (!newLike) {
      throw new ApiError(
        500,
        "Internal Server Error occurred while liking tweet"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Liked added Successfully"));
  } else {
    const removeLike = await Like.deleteOne({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    if (!removeLike) {
      throw new ApiError(
        500,
        "Internal server Error occurred while removing like from tweet"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removeLike,
          "Liked removed from tweet successfully"
        )
      );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  });
  return res.status(200).json(new ApiResponse(200, likedVideos, "Fetched"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
