import { Course } from "../models/Course.model.js";
import { Purchase } from "../models/Purchase.mode.js";
import { Resources } from "../models/Resources.model.js";
import { User } from "../models/User.model.js";

export const getInstructoCourse = async (req, res) => {
  try {
    const { _id } = req?.user;
    const courses = await User.findOne({ _id }, { course: 1 }).populate(
      "course"
    );
    const formatedData = courses?.course?.map(
      ({ thumbnail, title, price, createdAt, _id }) => ({
        courseId: _id,
        name: title,
        price,
        thumbnail: thumbnail?.url,
        publishedDate: createdAt,
      })
    );

    return res
      .status(200)
      .json({ success: true, instructorCourse: formatedData });
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const enrolledStudentInSpecificCourse = async (req, res) => {
  try {
    const { courseId } = req?.params;
    if (!courseId) {
      return res
        .status(404)
        .json({ success: false, message: "select a valid course" });
    }

    const purchases = await Purchase.find(
      {
        courseId: courseId,
        paymentStatus: "completed",
        userId:req?.user?._id
      },
      { userId: 1 }
    ).populate("userId", "avatar name email");

    const enrolledStudentDet = purchases?.map(({ userId: user }) => ({
      userName: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      userId: user?._id,
    }));
    return res
      .status(200)
      .json({ success: true, enrolledDetails: enrolledStudentDet });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
import pkg from "streamifier";
const streamifier = pkg.default ?? pkg;
import { v2 as cloudinary } from "cloudinary";

export const uploadResourcesStream = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res.status(400).json({
        success: false,
        message: "Course ID or Lecture ID missing",
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const originalName = req.file.originalname.trim();
    const ext = originalName.split(".").pop();
    const baseName = originalName.substring(0, originalName.lastIndexOf("."));
    const safeBase = baseName.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    const public_id = `${Date.now()}-${safeBase}.${ext}`;


    const mime = req.file.mimetype;
    const isPDF = mime === "application/pdf";
    const isVideo = mime.startsWith("video/");
    const resource_type = isPDF ? "raw" : isVideo ? "video" : "auto"; // ✅ Important line

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type, // ✅ used after definition
            folder: "lms_uploads",
            public_id,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    return res.status(200).json({
      success: true,
      message: "Resource uploaded successfully",
      data: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Upload Resource Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { _id: instructorId } = req.user;

    if (!courseId || !instructorId) {
      return res.status(400).json({
        success: false,
        message: "Course ID or instructor ID is missing",
      });
    }

    const resources = await Resources.find({
      instructor: instructorId,
      courseId,
    });

    return res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Error in getAllResources:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching resources",
    });
  }
};
