import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  // check if channel exists
  //console.log(channelId);
  const validity = isValidObjectId(channelId);
  if (!validity) {
    throw new ApiError(400, "Invalid channel id");
  }
  const userId = req.user._id;
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });
  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed Channel Successfullly"));
  } else {
    const newSubscription = new Subscription({
      channel: channelId,
      subscriber: userId,
    });
    await newSubscription.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Subscribed Channel Successfullly"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //console.log(channelId);
  const validity = isValidObjectId(channelId);
  if (!validity) {
    throw new ApiError(400, "Invalid channel id");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        subscriberDetails: 1,
      },
    },
  ]);
  if (!subscribers) {
    throw new ApiError(404, "No subscribers found");
  }
  return res.status(200).json(new ApiResponse(200, subscribers));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  //console.log(subscriberId);
  const validity = isValidObjectId(subscriberId);
  if (!validity) {
    throw new ApiError(400, "Invalid subscriber id");
  }
  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        channelDetails: 1,
      },
    },
  ]);
  if (!channels) {
    throw new ApiError(404, "No channels found");
  }
  return res.status(200).json(new ApiResponse(200, channels));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
