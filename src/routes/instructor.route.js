import express from "express";
import multer from "multer";
import {
  enrolledStudentInSpecificCourse,
  getAllResources,
  getInstructoCourse,
  uploadResourcesStream
} from "../controller/instructor.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isInstructor } from "../middleware/isInstructor.js";
const instructorRoute = express.Router();

instructorRoute.get(
  "/instructor-course",
  isAuthenticated,
  isInstructor,
  getInstructoCourse
);

instructorRoute.get(
  "/instructor/course/enrolled/:courseId",
  isAuthenticated,
  isInstructor,
  enrolledStudentInSpecificCourse
);

const upload = multer(); // handles `multipart/form-data`

instructorRoute.post(
  "/instructor/course/upload-resources",
  isAuthenticated,
  upload.single('resources'),  // name must match input field
  uploadResourcesStream
);

instructorRoute.get("/instructor/all-resources/:courseId",isAuthenticated,isInstructor,getAllResources)

export { instructorRoute };

