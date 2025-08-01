import { Course } from "../models/Course.model.js";
import { Purchase } from "../models/Purchase.mode.js";
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

    const purchases = await Purchase.find({
      courseId: "688af0fa54314b9b5641678b",
      paymentStatus: "completed",
    },{userId:1}).populate("userId", "avatar name email");
 console.log(purchases);

    const enrolledStudentDet = purchases?.map(({userId:user})=>({
        userName:user?.name,
        email:user?.email,
        avatar:user?.avatar,
        userId:user?._id
    }))
    return res.status(200).json({success:true,enrolledDetails:enrolledStudentDet})
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.message });
  }
};
