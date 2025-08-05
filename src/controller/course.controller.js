import cloudinary from "../../config/cloudinary.config.js";
import { Course } from "../models/Course.model.js";
import { Lecture } from "../models/Lecture.model.js";
import { LectureProgress } from "../models/LectureProgress.js";
import { Purchase } from "../models/Purchase.mode.js";
import { Review } from "../models/Review.model.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const user = req?.user;

    const { title, subTitle, price, discountPrice, description, courselevel } =
      req.body;

    const { path, filename } = req.file || {};

    // Log request for debugging
    // console.log("Incoming course creation request");

    // console.log({
    //   title,
    //   price,
    //   discountPrice,
    //   description,
    //   courselevel,
    //   path,
    //   filename,
    // });

    // Validate required fields
    if (
      !title ||
      !price ||
      !discountPrice ||
      !description ||
      !courselevel ||
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newCourse = {
      title,
      subTitle,
      thumbnail: {
        public_id: filename,
        url: path,
      },
      price,
      discountPrice,
      description,
      courselevel,
      creator: user?._id,
    };

    const createdCourse = await Course.create(newCourse);
    const usr = await User.findOne({ _id: user?._id });
    console.log(usr);
    usr.course.push(createdCourse?._id);
    await usr.save();

    if (!createdCourse) {
      return res.status(500).json({
        success: false,
        message: "Course creation failed",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: createdCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublish: true })
      .populate("creator", "name avatar")
      .limit(10);
    return res.status(200).json({ success: true, message: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req?.user?._id });
    return res.status(200).json({ success: true, myCourses: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req?.params;
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "course not found" });
    }
    const course = await Course.findById({ _id: id });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "course not found" });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req?.params;
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Not a valid course" });
    }
    const { title, subTitle, price, discountPrice, description, courseLevel } =
      req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: id },
      { title, subTitle, price, discountPrice, description, courseLevel },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "course updated", updatedCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const uploadLecture = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    const { title, isFree } = req.body;

    // Validate required data
    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { path, filename } = req.file;

    console.log("✅ Cloudinary upload complete:", {
      url: path,
      public_id: filename,
    });

    const lecture = {
      vedio: {
        public_id: filename,
        url: path,
      },
      lectureTitle: title,
      courseId,
      isFree: isFree === "true" || isFree === true, // handle string/boolean
    };

    const createdLecture = await Lecture.create(lecture);
    console.log(createdLecture);
    const course = await Course.findById({ _id: courseId });
    course.lectures.push(createdLecture?._id);
    await course.save();

    res.status(201).json({
      message: "Lecture uploaded successfully",
      data: createdLecture,
    });
  } catch (error) {
    console.error(" Upload failed:", error.message);
    return res.status(500).json({
      error: "Internal server error: " + error.message,
    });
  }
};

export const getLectureVedioInstructor = async (req, res) => {
  try {
    const { courseId } = req?.params;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "select course" });
    }

    const lectures = await Lecture.find({ courseId });
    return res.status(200).json({ success: true, lectures });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req?.params;
    const { public_id } = req?.body;

    if (!lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "plese select lecture to delete" });
    }
    const resp = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
      invalidate: true,
    });

    // remove lecture form course doc
    const course = await Lecture.findById({ _id: lectureId });
    await Course.updateOne(
      { _id: course?.courseId },
      { $pull: { lectures: lectureId } }
    );

    const deleteLecture = await Lecture.findByIdAndDelete({ _id: lectureId });

    if (deleteLecture) {
      return res
        .status(200)
        .json({ success: true, message: "lecture deleted" });
    }
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!lectureId || !title) {
      return res.status(400).json({
        success: false,
        message: "lectureId and title are required",
      });
    }

    const lecture = await Lecture.findById({ _id: lectureId });
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Update title
    lecture.lectureTitle = title;

    // If new video is uploaded
    if (file?.path && file?.filename) {
      // Delete old video from Cloudinary
      if (lecture.vedio?.public_id) {
        await cloudinary.uploader.destroy(lecture.vedio.public_id);
      }

      // Set new video info
      lecture.vedio = {
        public_id: file.filename,
        url: file.path,
      };
    }

    // Save the updated lecture
    const updated = await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      updated,
    });
  } catch (error) {
    console.log("Edit Lecture Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getSingleLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    if (!lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "select lecture" });
    }

    const lecture = await Lecture.findById({ _id: lectureId });
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "lecture not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "lecture found", lecture });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const makeCoursePublic = async (req, res) => {
  try {
    const { courseId } = req?.params;
    const { isPublish } = req?.body;
    const course = await Course.findById({ _id: courseId });

    const lectures = await Lecture.find({ courseId });
    if (lectures?.length == 0) {
      return res
        .status(400)
        .json({ success: false, message: "first upload at least 1 lecture" });
    }
    if (!course) {
      return res
        .status(200)
        .json({ success: false, message: "course not found" });
    }
    course.isPublish = isPublish;
    await course.save();

    return res
      .status(200)
      .json({ success: true, message: "course now published" });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Search keyword is required" });
    }

    // Case-insensitive regex search on title
    const course = await Course.find({
      title: { $regex: name, $options: "i" },
    }).populate("creator");

    return res.status(200).json({ success: true, message: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const userLearningProgress = async (req, res) => {
  try {
    const { _id: userId } = req?.user;
    const colors = [
      "Red",
      "Green",
      "Blue",
      "Yellow",
      "Orange",
      "Purple",
      "Pink",
      "Brown",
      "Black",
      "White",
      "Gray",
      "Cyan",
      "Magenta",
      "Lime",
      "Teal",
      "Indigo",
      "Violet",
      "Maroon",
      "Olive",
      "Navy",
    ];

    const { enrolled } = await User.findById({ _id: userId }).populate(
      "enrolled",
      "title _id lectures"
    );
    // console.log(enrolled);
    // find the completed lectures
    const lecProg = await Promise.all(
      enrolled?.map(async ({ _id: courseId }) => {
        const comLect = await LectureProgress.find({
          userId,
          courseId,
        }).countDocuments();
        return {
          courseId,
          comLect,
        };
      })
    );
    // console.log(lecProg);

    const formatedData = enrolled?.map(({ _id: courseId, title, lectures }) => {
      const { comLect } = lecProg?.find((lec) => lec?.courseId == courseId);
      let prog = 0;
      if (lectures?.length) {
        prog = parseInt((comLect / lectures?.length) * 100);
      }
      const colour1 = colors[Math.floor(Math.random() * colors.length)];
      const colour2 = colors[Math.floor(Math.random() * colors.length)];
      return {
        courseId,
        progressValue: prog,
        title: title.toUpperCase(),
        colour1,
        colour2,
      };
    });

    return res.status(200).json({ success: false, progress: formatedData });
  } catch (error) {
    console.log(error?.message);
  }
};

export const exploreCourse = async (req, res) => {
  try {
    const allCourses = await Course.find({ isPublish: true }).populate(
      "creator",
      "name avatar"
    );

    return res.status(200).json({ success: true, course: allCourses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getMyEnrolledCourse = async (req, res) => {
  try {
    const { _id } = req?.user;
    if (!_id) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access" });
    }

    const enrolledCourse = await Purchase.find({
      userId: _id,
      paymentStatus: "completed",
    }).populate("courseId");
    // console.log(_id);
    // console.log("enrol ",enrolledCourse);
    let course = enrolledCourse?.map(({ courseId: cour }) => ({
      courseId: cour?._id,
      title: cour?.title,
      thumbnail: cour?.thumbnail?.url,
      price: cour?.price,
    }));

    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const feedBack = async (req, res) => {
  try {
    const { courseId, review, rating } = req?.body;
    if (!courseId || !review || !rating) {
      return res
        .status(404)
        .json({ success: false, message: "some field is missing" });
    }

    const createdReview = await Review.create({
      review,
      courseId,
      reviewer: req?.user?._id,
      rating,
    });

    return res.status(200).json({ success: false, review: createdReview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};


export const courseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { _id: userId } = req.user;

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing courseId or userId",
      });
    }

    const reviews = await Review.aggregate([
  {
    $match: {
      courseId: new mongoose.Types.ObjectId(courseId),
      rating: { $gte: 2 },
    },
  },
  {
    $sort: { createdAt: -1 },
  },
  {
    $group: {
      _id: "$reviewer",
      review: { $first: "$$ROOT" },
    },
  },
  {
    $replaceRoot: { newRoot: "$review" },
  },
  {
    $limit: 5,
  },
  {
    $lookup: {
      from: "users",
      localField: "reviewer",
      foreignField: "_id",
      as: "reviewer",
    },
  },
  {
    $unwind: "$reviewer",
  },
]);


    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
