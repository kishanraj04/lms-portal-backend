import { Course } from "../models/Course.model.js";
import { LectureProgress } from "../models/LectureProgress.js";
import { Purchase } from "../models/Purchase.mode.js";
import { User } from "../models/User.model.js";

export const saveLectureProgress = async (req, res) => {
  try {
    const { courseId, played, duration, progress, lectureId } = req.body;
    if (!courseId || !played || !duration || !progress) {
      return res
        .status(400)
        .json({ success: false, message: "somethin missing" });
    }
    const lectureProgress = await LectureProgress.updateOne(
      { lectureId: lectureId, userId: req?.user?._id }, // Filter
      {
        $set: {
          duration,
          progress,
          lectureId,
          courseId,
          userId: req?.user?._id,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ success: true, lectureProgress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

export const getCompletedLecture = async (req, res) => {
  try {
    const { _id: userId } = req?.user;
    const { courseId } = req?.params;

    // Fetch all progress documents for that user & course
    const completedLectures = await LectureProgress.find({ userId, courseId });

    // Extract only lectureIds from completed progress
    const completedLectureIds = completedLectures.map((item) => item.lectureId);

    return res.status(200).json({
      success: true,
      completedLectureIds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};

// for pichart
export const instructorCourseWithPrice = async (req, res) => {
  try {
    const { _id } = req?.user;
    // course publish by user
    const courses = await Course.find({ creator: _id });

    let modifyCourse = courses?.map(({ title, price }) => ({
      name: title,
      value: parseInt(price),
    }));
    if (modifyCourse.length == 0) {
      modifyCourse = {
        name: "no course created",
        value: 0,
      };
    }
    return res
      .status(200)
      .json({ success: true, courseWithPrice: modifyCourse });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error?.message, courseWithPrice: [] });
  }
};

// for pichart
export const courseWithEnrollStudent = async (req, res) => {
  try {
    const { _id } = req?.user;

    const course = await User.findOne({ _id }).populate({ path: "course" });
    // console.log(course);
    let courseWithEnrolledStu = await Promise.all(
      course?.course?.map(async ({ _id, title }) => {
        const purchase = await Purchase?.find({ courseId: _id });
        return { name: title, value: purchase?.length };
      })
    );
    if (courseWithEnrolledStu?.length == 0) {
      courseWithEnrolledStu = {
        name: " ",
        value: 0,
      };
    }

    return res.status(200).json({
      success: true,
      courseWithEnrolledStudents: courseWithEnrolledStu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message,
      courseWithEnrolledStudents: {
        name: " ",
        value: 0,
      },
    });
  }
};

// for line chart
export const monthRevenue = async (req, res) => {
  try {
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];

    // Step 1: Get course _ids created by this instructor
    const instructorCourses = await Course.find(
      { creator: req?.user?._id },
      { _id: 1 }
    );

    // Step 2: Extract _id values from courses
    const courseIds = instructorCourses.map(course => course._id);

    // Step 3: Get completed purchases for instructor's courses
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      paymentStatus: "completed"
    });

    // Step 4: Initialize month map
    const monthMap = new Map(months.map((month) => [month, 0]));

    // Step 5: Sum revenue by month
    purchases?.forEach(({ amount, month }) => {
      const key = month.toLowerCase(); // Normalize month string
      if (monthMap.has(key)) {
        const current = monthMap.get(key);
        monthMap.set(key, current + amount);
      }
    });

    // Step 6: Respond with the revenue data
    res.status(200).json({
      success: true,
      data: Object.fromEntries(monthMap)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



