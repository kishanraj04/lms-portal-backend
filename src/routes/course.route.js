import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createCourse,
  deleteLecture,
  editCourse,
  getAllCourses,
  getCourseById,
  getLectureVedioInstructor,
  getMyCourses,
  uploadLecture,
} from "../controller/course.controller.js";
import { isInstructor } from "../middleware/isInstructor.js";
import { uploadLectureMidd, uploadThumbnail } from "../middleware/multer.js";

const courseRoute = express.Router();

courseRoute.post(
  "/create",
  uploadThumbnail,
  isAuthenticated,
  isInstructor,
  createCourse
);

courseRoute.get("/allCourse", isAuthenticated, getAllCourses);

courseRoute.get("/me", isAuthenticated, isInstructor, getMyCourses);

courseRoute.get("/:id", isAuthenticated, isInstructor, getCourseById);

courseRoute.put("/:id", isAuthenticated, isInstructor, editCourse);

courseRoute.post(
  "/upload/lecture/:id",
  isAuthenticated,
  isInstructor,
  (req, res, next) => {
    uploadLectureMidd(req, res, (err) => {
      if (err) {
        // Multer errors
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message, code: err.code });
        }
        // Any other error inside multer/cloudinary
        return res.status(500).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  },
  uploadLecture
);

courseRoute.get("/getlecture/instructor/:courseId",isAuthenticated,isInstructor,getLectureVedioInstructor)

courseRoute.delete("/delete/lecture/:lectureId",isAuthenticated,isInstructor,deleteLecture)

export { courseRoute };
