import express from "express";
import {
  createCourse,
  deleteLecture,
  editCourse,
  editLecture,
  exploreCourse,
  getAllCourses,
  getCourseById,
  getLectureVedioInstructor,
  getMyCourses,
  getMyEnrolledCourse,
  getSingleLecture,
  makeCoursePublic,
  searchCourse,
  uploadLecture,
  userLearningProgress,
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

courseRoute.get("/course/:name",isAuthenticated,searchCourse)

courseRoute.get("/me", isAuthenticated, isInstructor, getMyCourses);

courseRoute.get("/:id", isAuthenticated, isInstructor, getCourseById);

courseRoute.put("/:id", isAuthenticated, isInstructor, editCourse);

courseRoute.post(
  "/upload/lecture/:id",
  isAuthenticated,
  isInstructor,
  uploadLectureMidd,
  uploadLecture
);

courseRoute.get("/getlecture/instructor/:courseId",isAuthenticated,isInstructor,getLectureVedioInstructor)

courseRoute.delete("/delete/lecture/:lectureId",isAuthenticated,isInstructor,deleteLecture)

courseRoute.put("/updata/lecture/:lectureId",isAuthenticated,isInstructor,uploadLectureMidd,editLecture)

courseRoute.get("/lecture/:lectureId",isAuthenticated,isInstructor,getSingleLecture)

courseRoute.put("/publishthecourse/:courseId",isAuthenticated,isInstructor,makeCoursePublic)


// checkout
courseRoute.post("/checkout/create-checkout-session",isAuthenticated,createCheckoutSession)

// get course for detail page with purchase status
courseRoute.get("/course/course-purchase-status/:courseId",isAuthenticated,getCourseDetailWithPurchaseStatus)



// for learing page
courseRoute.get("/course/learning/progress",isAuthenticated,userLearningProgress)

// explore course
courseRoute.get("/explore/courses",isAuthenticated,exploreCourse)

courseRoute.get("/me/enrolled-course",isAuthenticated,getMyEnrolledCourse)

export { courseRoute };

