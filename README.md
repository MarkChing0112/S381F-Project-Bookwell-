# Project: BookWell
    Group No: 24
    Group Member: 
        * [Ching Man Ho,13019210] 
        * [Cheng Ho Lung,13070826]

# User Guide:
## **implement:**
    Bootstrap:
    npm install bootstrap@3

## User Account:
    [Username: student,password: student]
* Step 1: User login and access our server
* Step 2: after login user will be go to home page
* Step 3: Server will display list of book for user, also user allows to search a books.
## Book Detail
* Step 1: user click the view detail button at the home page.
* Step 2: System will find and display the books detail for user.
* Step 3: When user want to go out. click the "Back to home" button or nav bar home icon.
## Search books

## Admin Account:
    [username: admin,password:admin]

### Access Admin System:
* Step 1: Admin user input the url "http://localhost:8099/admin" or "https://bookwell.herokuapp.com/admin" to the admin login page.
* Step 2: after login, the admin user will be go to the admin page to manage book details.

### create book:
* Step 1: Admin click the add book button to create page create a new book.
* Step 2: Admin input the book information in the fields.
* Step 3: Admin select an image of book cover page the photo type limited "jpg,jpeg,png".
* Step 4: Click the "Submit" Button.

### update books:
* Step 1: Admin select a book of the list and click the edit button go to the edit page.
* Step 2: Admin input the new data to each field.
* Step 3: Click the "Submit" Button.

### delete book:
* Step 1: Admin click the delete button to delete book data.

# Restful service:
    get book data using curl .
    curl -X GET localhost:8099/api/book/BookName/Cats
    curl -X GET localhost:8099/api/book/Author/PhilStamper