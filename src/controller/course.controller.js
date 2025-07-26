import cloudinary from "../../config/cloudinary.config.js";
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
        const courses = await Course.find({isPublish:true}).populate("creator","name avatar");
        return res.status(200).json({success:true,message:courses})
    } catch (error) {
        return res.status(500).json({success:false,message:error?.message})
    }
}

export const getMyCourses  = async(req,res)=>{
    try {
        
        const courses = await Course.find({creator:req?.user?._id})
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

    const createdLecture =await  Lecture.create(lecture);
    console.log(createdLecture);
    const course = await Course.findById({_id:courseId})
    course.lectures.push(createdLecture?._id)
    await course.save()

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

export const getLectureVedioInstructor = async(req,res)=>{
  try {
    const {courseId} = req?.params
    if(!courseId){
      return res.status(400).json({success:false,message:"select course"})
    }

    const lectures = await Lecture.find({courseId})
    return res.status(200).json({success:true,lectures})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}

export const deleteLecture = async(req,res)=>{
  try {
    const {lectureId} = req?.params
    const {public_id} = req?.body

    if(!lectureId){
      return res.status(400).json({success:false,message:"plese select lecture to delete"})
    }
    const resp = await cloudinary.uploader.destroy(public_id,{ resource_type: "video",invalidate:true})

    // remove lecture form course doc
    const course = await Lecture.findById({_id:lectureId})
   await Course.updateOne({_id:course?.courseId},{$pull:{lectures:lectureId}})

    const deleteLecture = await Lecture.findByIdAndDelete({_id:lectureId})
    
    

    if(deleteLecture){
      return res.status(200).json({success:true,message:"lecture deleted"})
    }
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({success:false,message:error?.message})
  }
}

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

    const lecture = await Lecture.findById({_id:lectureId});
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


export const getSingleLecture = async(req,res)=>{
  try {
    const {lectureId} = req.params
    if(!lectureId){
      return res.status(400).json({success:false,message:"select lecture"})
    }

    const lecture = await Lecture.findById({_id:lectureId})
    if(!lecture){
      return res.status(404).json({success:false,message:"lecture not found"})
    }

    return res.status(200).json({success:true,message:"lecture found",lecture})
  } catch (error) {
    return res.status(500).json({success:false,message:error?.message})
  }
}

export const makeCoursePublic = async(req,res)=>{
  try {
    console.log("req");
    const {courseId} = req?.params;
    const {isPublish} = req?.body;
    console.log("CI ",courseId,isPublish,req?.body);
    const course = await Course.findById({_id:courseId})
    if(!course){
      return res.status(200).json({success:false,message:"course not found"})
    }
    course.isPublish = isPublish;
    await course.save()

    return res.status(200).json({success:true,message:"course now published"})
  } catch (error) {
    console.log(error?.message);
    return res.status(500).json({success:false,message:error?.message})
  }
}