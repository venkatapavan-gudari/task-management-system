# Task Management System

## Project Overview

Simple task management system where:

* Admin creates tasks
* Assigns tasks to multiple users
* Users lock tasks
* Add work entries
* Complete tasks

## Technologies Used
* React JS
* Spring Boot
* MySQL
* Spring Data JPA

## Database Tables
* `users`
* `tasks`
* `task_assignments` (junction table)
* `work_entries`

## Important Business Logic
* Create tasks and assign to multiple users
* Fetch tasks assigned to multiple users
* Prevents multiple users from working on the same task simultaneously using locking mechanism
* Task status updates
* Work entry logging
* Task completion

## API Endpoints
* Create Task
* Get Assigned Tasks
* Lock Task
* Add Work Entry
* Complete Task

## Frontend Screens
* Admin Dashboard
* User Dashboard
* Task Working Screen

## Design Decisions
* Login and registration were intentionally not implemented because they were not part of the assignment requirements.
* Users were manually inserted into the database.
* Focus was mainly on backend business logic and REST APIs.

## How to Run

### Backend
1. Open Spring Boot project
2. Configure MySQL in `application.properties`
3. Run application

### Frontend
1. `npm install`
2. `npm start`
