import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skipper = (page - 1) * limit;
  //TODO: get all videos based on query, sort, pagination
  const videos = await Video.find({}).skip(skipper).limit(limit);
  if (!videos) {
    throw new ApiError(400, "No videos found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files) {
    throw new ApiError(
      400,
      "error occurred while creating local path through multer"
    );
  }
  const videoFile = req.files.videoFile ? req.files.videoFile[0].path : null;
  const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;
  const videoCloud = await uploadOnCloudinary(videoFile);
  const thumbnailCloud = await uploadOnCloudinary(thumbnail);

  if (!videoCloud || !thumbnailCloud) {
    throw new ApiError(
      500,
      "Internal Server error occurred while uploading video"
    );
  }
  //console.log(videoCloud);
  const newVideo = await Video.create({
    videoFile: videoCloud.url,
    thumbnail: thumbnailCloud.url,
    owner: req.user._id,
    title,
    description,
    duration: videoCloud.duration,
  });
  if (!newVideo) {
    throw new ApiError(500, "Video not created due to server error");
  }
  return res.status(200).json(new ApiResponse(200, newVideo, "Video Created"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid Video Request");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exists in the database");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description
  const { updateTitle, updateDesc } = req.body;

  if (!updateTitle && !updateDesc) {
    throw new ApiError(400, "Title or description must be given");
  }
  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid Video Id for update request");
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: updateTitle,
        description: updateDesc,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVideo) {
    throw new ApiError(
      400,
      "Internal server error occurred while updating video"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video Updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid Video Delete request");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exists in the database");
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new ApiError(
      500,
      "Internal Server Error occurred while deleting the video"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid VideoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exists in the database");
  }
  const updatedIsPublished = !video.isPublished;
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: updatedIsPublished,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVideo) {
    throw new ApiError(
      500,
      "Internal Server error occurred while togglePublishStatus "
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        "Video Published StatusToggled Successfully"
      )
    );
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const validity = isValidObjectId(videoId);
  if (!validity) {
    throw new ApiError(400, "Invalid VideoId request for updating thumnail");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video doesnot exists in the database");
  }
  if (!req.file) {
    throw new ApiError(400, "thumnail is required");
  }
  const updateThumbnail = req.file?.path;
  if (!updateThumbnail) {
    throw new ApiError(400, "File did not get uploaded through multer");
  }
  const thumbnailCloud = await uploadOnCloudinary(updateThumbnail);
  if (!thumbnailCloud) {
    throw new ApiError(
      500,
      "Server error occurred while uploading file on cloudinary"
    );
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnailCloud.url,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVideo) {
    throw new ApiError(500, "Error occured video thumbnail is not updated");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video Thumbnail updated Successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  updateVideoThumbnail,
};
