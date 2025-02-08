import  { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { valkey } from "../app.js";

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
  
  // check if user's tweets is presemt in the redis server or not
  const keyCached = `tweets:${req.user._id}`;
  const cachedTweets = await valkey.get(keyCached);
  if (cachedTweets) {
    return res
      .status(200)
      .json(new ApiResponse(200,JSON.parse(cachedTweets),"All Tweets From Specific User Fetched Successfully"));
    }
  
  const tweetsFromUser = await Tweet.find({
    owner: req.user._id,
  });
  if (!tweetsFromUser) {
    throw new ApiError(
      500,
      "Internal Server Error while getting tweets from specific user"
    );
  }
  // store the response in the redis server
  const key = `tweets:${req.user._id}`;
  const value = JSON.stringify(tweetsFromUser);
  valkey.set(key, value, "EX", 60);

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
  // if tweet is present in the redis cache then delete it
  const tweetInCache = await valkey.get(tweetId);
  if (tweetInCache) {
    valkey.del(tweetId);
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
  // check if tweet is present in the redis cache then delete it
  const tweetInCache = await valkey.get(tweetId);
  if (tweetInCache) {
    valkey.del(tweetId);
  }
  if (await Tweet.findByIdAndDelete(tweetId)) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet Deleted Successfully"));
  } else throw new ApiError(500, "Internal Server erro while deleting a tweet");
});

const getTweetById = asyncHandler(async (req, res) => {
  const {tweetId} = req.params;
  const validity = isValidObjectId(tweetId);
  if (!validity) {
    throw new ApiError(400, "Invalid Tweet Id");
  }
  // chheck if tweet is present in the redis cache 
  const tweetInCache = await valkey.get(tweetId);
  if (tweetInCache) {
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(tweetInCache), "Tweet fetched successfully"));
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet does not exists");
  }
  // store the response in the redis server
  const key = tweetId;
  const value = JSON.stringify(tweet);
  valkey.set(key, value, "EX", 60);
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet, getTweetById };

