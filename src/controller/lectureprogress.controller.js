import { LectureProgress } from "../models/LectureProgress.js";

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
