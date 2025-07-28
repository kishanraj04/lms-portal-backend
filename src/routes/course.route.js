import express from "express";
import {
  createCourse,
  deleteLecture,
  editCourse,
  editLecture,
  getAllCourses,
  getCourseById,
  getLectureVedioInstructor,
  getMyCourses,
  getSingleLecture,
  makeCoursePublic,
  uploadLecture,
} from "../controller/course.controller.js";
import { createCheckoutSession, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controller/purchase.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
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

courseRoute.put("/updata/lecture/:lectureId",isAuthenticated,isInstructor,uploadLectureMidd,editLecture)

courseRoute.get("/lecture/:lectureId",isAuthenticated,isInstructor,getSingleLecture)

courseRoute.put("/publishthecourse/:courseId",isAuthenticated,isInstructor,makeCoursePublic)


// checkout
courseRoute.post("/checkout/create-checkout-session",isAuthenticated,createCheckoutSession)

courseRoute.get("/course/course-purchase-status",isAuthenticated,getCourseDetailWithPurchaseStatus)

// courseRoute.post("/webhook",express.raw({type:"application/json"}),stripeWebhook)

export { courseRoute };

