import { Course } from "../models/Course.model.js";
import { Lecture } from "../models/Lecture.model.js";
export const createCourse = async (req, res) => {
  try {
    const user = req?.user;

    const {
      title,
      price,
      discountPrice,
      description,
      courselevel,
    } = req.body;

    const { path, filename } = req.file || {};

    // Log request for debugging
    console.log("Incoming course creation request");

    console.log({
      title,
      price,
      discountPrice,
      description,
      courselevel,
      path,
      filename,
    });

    // Validate required fields
    if (!title || !price || !discountPrice || !description || !courselevel || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newCourse = {
      title,
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


export const getAllCourses  = async(req,res)=>{
    try {
        const courses = await Course.find({}).populate("creator","name avatar");
        return res.status(200).json({success:true,message:courses})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}

export const getMyCourses  = async(req,res)=>{
    try {
        
        const courses = await Course.find({creator:req?.user?._id})
        console.log(courses);
        return res.status(200).json({success:true,myCourses:courses})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}

export const getCourseById = async(req,res)=>{
  try {
    const {id} = req?.params
    if(!id){
      return res.status(404).json({success:false,message:"course not found"})
    }
    const course = await Course.findById({_id:id})
    if(!course){
      return res.status(404).json({success:false,message:"course not found"})
    }
    return res.status(200).json({success:true,course})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}

export const editCourse = async(req,res)=>{
  try {
    const {id} = req?.params
    if(!id){
      return res.status(404).json({success:false,message:"Not a valid course"})
    }
    const {title,price,discountPrice,description,courseLevel} = req.body
    
    const updatedCourse = await Course.findByIdAndUpdate({_id:id},{title,price,discountPrice,description,courseLevel},{new:true})

    return res.status(200).json({success:true,message:"course updated",updatedCourse})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}
export const uploadLecture = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { title, isFree } = req.body;


    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const {path,filename} = req.file

    const lecture = {
      vedio:{
        public_id:filename,
        url:path
      },
      lectureTitle:title,
      courseId,
      isFree
      
    }
    const createdLecture = await Lecture.create(lecture)

    res.status(200).json({
      message: "Lecture uploaded successfully",
      createdLecture,
    });
  } catch (error) {
    console.error("Upload failed:", error.message);
    res.status(500).json({ error: error.message });
  }
};
