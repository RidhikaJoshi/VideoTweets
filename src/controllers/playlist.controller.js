import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  const newPlaylist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
  if (!newPlaylist) {
    throw new ApiError(
      500,
      "Internal Server Error Occurred while creating a new playlist"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, newPlaylist, "New Playlist created Successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  // fetching all the playlists of the user
  const validity = isValidObjectId(userId);
  if (!validity) {
    throw new ApiError(400, "Invalid userId");
  }
  const allPlaylists = await Playlist.find({ owner: userId });
  if (!allPlaylists) {
    throw new ApiError(
      500,
      "Internal Server Error occurred while fetching all the playlist of the user"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, allPlaylists, "User Playlists Fetched Successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const validity = isValidObjectId(playlistId);
  if (!validity) {
    throw new ApiError(400, "Invalid Playlist Id provided");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "No playlist found in the database");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Fetched Successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const validPlaylist = isValidObjectId(playlistId);
  if (!validPlaylist) {
    throw new ApiError(400, "Invalid Playlist Id");
  }
  const validVideoId = isValidObjectId(videoId);
  if (!validVideoId) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const playlist = await Playlist.findOne({ _id: playlistId });
  if (!playlist) {
    throw new ApiError(400, "Playlist not found in the databse");
  }
  if (!playlist.videos) {
    playlist.videos = []; // Initialize videos array if it's undefined
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already exists in the playlist");
  }
  playlist.videos.push(videoId);
  const addedVideo = await playlist.save();
  if (!addedVideo) {
    throw new ApiError(
      500,
      "Internal Server Error occurred while adding videos to the playlist"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, addedVideo, "Video Added to the playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const validPlaylist = isValidObjectId(playlistId);
  const validVideo = isValidObjectId(videoId);
  if (!validPlaylist) {
    throw new ApiError(400, "Invalid Playlist Id provided");
  }
  if (!validVideo) {
    throw new ApiError(400, "Invalid VideoId provided");
  }
  const playlist = await Playlist.findOne({ _id: playlistId });
  if (!playlist) {
    throw new ApiError(400, "Playlist does not exists in the database");
  }
  const videoPresentInPlaylist = playlist.videos.includes(videoId);
  if (!videoPresentInPlaylist) {
    throw new ApiError(400, "Video does not exists in the Playlist");
  }
  const videoRemovedFromPlaylist = playlist.videos.filter(
    (video) => video != videoId
  );
  if (!videoRemovedFromPlaylist) {
    throw new ApiError(
      500,
      "Internal Server Error occurred while removing video from the playlist"
    );
  }
  //console.log(videoRemovedFromPlaylist);
  playlist.videos = videoRemovedFromPlaylist;
  const removedVideo = await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, removedVideo, "Video Removed from the Playlist")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  const validPlaylist = isValidObjectId(playlistId);
  if (!validPlaylist) {
    throw new ApiError(400, "Invalid playlist id for deletion of playlist");
  }
  const playlistPresent = await Playlist.findById(playlistId);
  if (!playlistPresent) {
    throw new ApiError(400, "Playlist is not present in the database");
  }
  const removedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!removedPlaylist) {
    throw new ApiError(
      500,
      "Internal Server error Occurred while deleting the playlist"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  const validPlaylist = isValidObjectId(playlistId);
  if (!validPlaylist) {
    throw new ApiError(400, "Invalid Playlist Id provided");
  }
  if (!name && !description) {
    throw new ApiError(
      400,
      "Either name or description must be provided for updation"
    );
  }
  const playlistPresent = await Playlist.findOne({ _id: playlistId });
  if (!playlistPresent) {
    throw new ApiError(400, "Playlist does not exists");
  }
  if (name !== "") {
    playlistPresent.name = name;
  }
  if (description !== "") {
    playlistPresent.description = description;
  }
  const newPlaylist = await playlistPresent.save();
  if (!newPlaylist) {
    throw new ApiError(
      500,
      "Internal Server error occurred while updating playlist"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist updated Successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
