# POOSD MERN Project

## AI Assistance Disclosure

This project was developed with assistance from generative AI tools:

- **Tool**: Claude Sonnet 4.6, Gemini 3 Flash (Google, Gemini App)
- **Dates**: March 8th - April 20th, 2026
- **Scope**: Troubleshooting and debugging deployment configuration, Zod schemas, and date conversions, frontend development of user account lifecycle flows (Email Activation, Forgot Password, and Password Reset), including UI state management and error handling for complex form validation.
- **Use**: Aided in diagnosing issues within the .yaml file​, suggested potential fixes and debugging strategies​, helped identify a missing SSH key configuration during deployment​, fixed string-to-date typecasting from JSON input to Zod schema​, helped with connecting Cloudinary for image storage, assisted in building React-based pages for email verification and password recovery, helped develop logic to parse URL tokens for secure resets, managed frontend state to provide real-time user feedback on password requirements, and refined the UI to handle various success and error states during the authentication process.

All AI-generated code was reviewed, tested, and modified to meet 
assignment requirements. Final implementation reflects my understanding 
of the concepts.

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
* Express backend: http://localhost:5001

To turn the off when done: 

```
^C
```

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
