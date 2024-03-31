import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const { content } = req.body;
  const newTweet = await Tweet.create({
    owner: req.user._id,
    content,
  });
  if (!newTweet) {
    throw new ApiError(500, "Internal Server error while creating new Tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, "New Tweet Added Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  // getting all tweets from a specific user in the form of an array
  const tweetsFromUser = await Tweet.find({
    owner: req.user._id,
  });
  if (!tweetsFromUser) {
    throw new ApiError(
      500,
      "Internal Server Error while getting tweets from specific user"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweetsFromUser,
        "All Tweets From Specific User Fetched Successfully"
      )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  // updating a tweet
  //console.log(req.params);
  const tweetId = req.params.tweetId;
  const validity = isValidObjectId(tweetId);
  if (!validity) {
    throw new ApiError(400, "Invalid Tweet Id");
  }
  const { updateContent } = req.body;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet does not exists");
  }
  const updatedtweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: updateContent,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedtweet) {
    throw new ApiError(500, "Internal Server Error While Updating the Tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedtweet, "Tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const tweetId = req.params.tweetId;
  const validity = isValidObjectId(tweetId);
  if (!validity) {
    throw new ApiError(400, "Invalid Tweet Id");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(400, "Tweet does not exists");
  if (await Tweet.findByIdAndDelete(tweetId)) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
  } else throw new ApiError(500, "Internal Server erro while deleting a tweet");
});
export { createTweet, getUserTweets, updateTweet, deleteTweet };
