# **Book Notes - Book Review Website**

This project is a simple book review platform built with **Node.js**, **Express.js**, **EJS**, **PostgreSQL**, **Axios**, and **Bootstrap**. The platform allows users to submit, edit, and delete their reviews of books they have read, including a rating system. All reviews are displayed on the homepage, offering a collection of user-submitted book reviews.

## **Features**

1. **Submit Book Reviews**: Users can submit reviews for any book, including a title, review text, and a rating.
2. **Edit Reviews**: Users can edit their existing reviews to update information.
3. **Delete Reviews**: Users have the ability to delete their reviews.
4. **Home Page Display**: The homepage displays all reviews submitted by users, with book titles, ratings, and review text.
5. **Book Cover Images**: The application fetches book cover images from Open Library using the ISBN.

## **Technologies Used**

- **Node.js**: JavaScript runtime environment for the server-side logic.
- **Express.js**: Web application framework for Node.js to handle routing and middleware.
- **EJS**: Embedded JavaScript templating for rendering dynamic HTML views.
- **PostgreSQL**: Relational database management system to store book reviews and user data.
- **Axios**: HTTP client to fetch book data and cover images from the Open Library API.
- **Bootstrap**: Frontend framework for responsive and clean user interface.
  
## Installation & Setup
To run the project locally:

#### Clone this repository:

###   `git clone https://github.com/your-username/repo-name.git  `

### `cd repo-name`

#### Install dependencies:

### `npm install`

#### Set up the .env file: Add your PostgreSQL credentials in a .env file:

### `PG_USER=your_database_user`
### `PG_HOST=localhost`
### `PG_DATABASE=your_database_name`
### `PG_PASSWORD=your_database_password`
### `PG_PORT=5432`

#### Start the development server:

### `npm start`

#### Access the website at http://localhost:3000

   
