# VideoTweets Backend

Welcome to the **VideoTweets** backend repository! This repository contains the backend codebase for **VideoTweets**, a platform designed for sharing and interacting with videos and tweets.

## Overview

**VideoTweets** aims to provide users with a seamless experience for sharing multimedia content, engaging with other users, and discovering new and trending videos and tweets. The backend of **VideoTweets** is built using:

- **Node.js** with **Express.js** framework
- **MongoDB** for data storage
- **Mongoose** for interacting with the database
- **Redis** for caching to improve performance

## Features

### 1. Comments
Users can comment on videos, tweets, or other content within the platform. They can:
- Add, edit, and delete comments
- Like and reply to comments

### 2. Likes
Users can express their appreciation for videos, tweets, comments, or other content by liking them. They can also:
- View the number of likes
- Interact with liked content

### 3. Playlists
Users can create playlists to organize their favorite videos. They can:
- Add and remove videos from playlists
- Manage their playlists

### 4. Tweets
Users can:
- Create, edit, and delete tweets
- View tweets from other users
- Engage with tweets through likes and comments
- Discover trending tweets

### 5. Users
The platform provides user authentication and authorization mechanisms to ensure secure access. Users can:
- Manage their profiles, settings, and preferences

### 6. Videos
**VideoTweets** supports uploading and sharing of videos. Users can:
- Upload videos
- View videos from other users
- Like and comment on videos
- Explore trending videos

### 7. Subscription
Users can **subscribe** and **unsubscribe** to channels within the platform.

## Controllers

The backend codebase is organized into separate controllers for different functionalities:

- **comment.controller.js** - Manages comment-related functionalities.
- **like.controller.js** - Handles like-related functionalities.
- **playlist.controller.js** - Controls playlist-related operations.
- **tweet.controller.js** - Manages tweet-related functionalities.
- **user.controller.js** - Handles user-related functionalities.
- **video.controller.js** - Manages video-related functionalities.
- **subscription.controller.js** - Manages subscription-related functionalities.

## Getting Started

To set up the **VideoTweets** backend locally, follow these steps:

1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com/your-username/videotweets-backend.git
   ```
2. Navigate to the project directory:
   ```sh
   cd videotweets-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up a **MongoDB** database and configure the connection string in the `.env` file.
5. Ensure **Redis** is running and configure the Redis URL in the `.env` file.
6. Run the backend server:
   ```sh
   npm run dev
   ```

## Using Docker

To set up the **VideoTweets** backend using Docker, follow these steps:

1. Clone this repository to your local machine.
2. Build the Docker image:
   ```sh
   docker build -t videotweets-backend .
   ```
3. Run the Docker container:
   ```sh
   docker run -p 4321:4321 -d videotweets-backend
   ```

### Using Docker Compose
Alternatively, you can use **Docker Compose** to set up the backend along with Redis:

1. Clone this repository to your local machine.
2. Ensure you have **Docker** and **Docker Compose** installed.
3. Run the following command to start the services:
   ```sh
   docker-compose up -d
   ```

This will start both the backend and Redis containers. The backend will be accessible at **http://localhost:4321**.

## Environment Variables

Refer to the `env.sample` file for the required environment variables and their configurations. Ensure you create a `.env` file in the root directory of your project and set the appropriate values.

---


