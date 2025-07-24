import { Course } from "../models/Course.model.js";
export const createCourse = async (req, res) => {
  try {
    const user = req?.user;
    const {
      title,
      price,
      discountPrice,
      description,
      courselevel,
    } = req?.body;

    console.log({ title, price, discountPrice, description, courselevel });

    // Validate required fields
    if (!title || !price || !description || !courselevel || !discountPrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { path, filename } = req?.file;

    const course = {
      title: title,
      thumbnail: {
        public_id: filename,
        url: path,
      },
      price: price,
      discountPrice: discountPrice,
      description: description,
      courselevel: courselevel,
      creator: user?._id,
    };

    const createdCourse = await Course.create(course);

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
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};
