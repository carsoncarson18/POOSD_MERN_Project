# POOSD MERN Project

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/carsoncarson18/POOSD_MERN_Project.git
cd POOSD_MERN_Project
```

### 2. Install dependencies

Install root dependencies:

```
npm install
```

Install frontend dependencies:

```
cd client
npm install
```

Install backend dependencies:

```
cd ../server
npm install
```

### 3. Run the application

From the project root:

```
npm run dev
```

This will start:

* React frontend: http://localhost:5173
* Express backend: http://localhost:5050

To turn the off when done: 

```
^C
```

### 4. Run Database

Make sure MongoDB is running locally before starting

The backend automatically connects to:

mongodb://localhost:27017/Scraps

The Database Schema can be found in server/models

## Github

Before starting work:

```
git pull
```

After making changes:

```
git add .
git commit -m "blah blah blah"
git push
```
