# VideoTweets Backend

Documentation: [Link]( https://documenter.getpostman.com/view/18992770/2sA2xpR8nu)


Welcome to the VideoTweets backend repository! This repository contains the backend codebase for VideoTweets, a platform designed for sharing and interacting with videos and tweets.

## Overview

VideoTweets aims to provide users with a seamless experience for sharing multimedia content, engaging with other users, and discovering new and trending videos and tweets. The backend of VideoTweets is built using Node.js with Express.js framework, MongoDB for data storage, and Mongoose for interacting with the database.

## Features

### 1. Comments

Users can comment on videos, tweets, or other content within the platform. They can add, edit, or delete comments, and interact with comments through likes and replies.

### 2. Likes

Users can express their appreciation for videos, tweets, comments, or other content by liking them. They can also view the number of likes and interact with liked content.

### 3. Playlists

VideoTweets allows users to create playlists to organize their favorite videos. Users can add videos to playlists, remove videos from playlists, and manage their playlists.

### 4. Tweets

Users can create, edit, and delete tweets within the platform. They can also view tweets from other users, engage with tweets through likes and comments, and discover trending tweets.

### 5. Users

The platform provides user authentication and authorization mechanisms to ensure secure access to user accounts. Users can manage their profiles, settings, and preferences.

### 6. Videos

VideoTweets supports uploading and sharing of videos. Users can upload videos, view videos from other users, like videos, comment on videos, and explore trending videos.

## Controllers

The backend codebase is organized into separate controllers for different functionalities:

- `comment.controller.js`: Manages comment-related functionalities.
- `like.controller.js`: Handles like-related functionalities.
- `playlist.controller.js`: Controls playlist-related operations.
- `tweet.controller.js`: Manages tweet-related functionalities.
- `user.controller.js`: Handles user-related functionalities.
- `video.controller.js`: Manages video-related functionalities.

## Getting Started

To set up the VideoTweets backend locally, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and configure the connection string in the `.env` file.
4. Run the backend server using `npm start`.

