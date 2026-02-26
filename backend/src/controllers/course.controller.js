import mongoose from "mongoose";
import { asyncHandler } from "../utils/asycHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { CourseSearch } from "../models/courseSearch.model.js";
import { Section } from "../models/section.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Enrollment } from "../models/enrollment.model.js";

// Helper function to convert unsupported languages to supported ones for text search
// const getSupportedLanguageForSearch = (language) => {
//     const supportedLanguages = ["english", "spanish", "french", "german", "italian", "portuguese", "russian", "swedish", "turkish", "danish", "dutch", "finnish", "hungarian", "norwegian", "polish"];
    
//     if (supportedLanguages.includes(language?.toLowerCase())) {
//         return language.toLowerCase();
//     }
    
//     // Map unsupported languages to closest supported alternative
//     const languageMap = {
//         "hindi": "english",
//         "tamil": "english",
//         "telugu": "english",
//         "kannada": "english",
//         "malayalam": "english",
//         "gujarati": "english",
//         "marathi": "english",
//         "punjabi": "english",
//         "bengali": "english",
//         "urdu": "english",
//         "chinese": "english",
//         "japanese": "english",
//         "korean": "english",
//         "thai": "english",
//         "vietnamese": "english",
//         "arabic": "english",
//         "hebrew": "english"
//     };
    
//     return languageMap[language?.toLowerCase()] || "english";
// };

const createCourse = asyncHandler(async (req, res) => {
    let category = req.body.category;

    // Parse category if it's a JSON string
    if (typeof category === 'string') {
        category = JSON.parse(category);
    }

    const { title, subtitle, description, price, level, language } = req.body;
    console.log("Request Body: ", req.body);
    console.log("Instructor ID: ", req.user._id);
    const instructorId = req.user._id;
    if (!title || !description || !level || !language) {
        throw new ApiError(400, "All required fields must be provided");
    }
    if (!category || !category.name || category.name === "") {
        throw new ApiError(400, "Category is required");
    }
    const instructor = await User.findById(instructorId);
    if (!instructor) {
        throw new ApiError(404, "Instructor not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Thumbnail file is required");
    }
    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const finalCategory = await Category.create({ name: category.name, description: category.description || "" });
    console.log("Created category:", finalCategory);

    if (!finalCategory) {
        throw new ApiError(500, "Failed to create category");
    }

    const course = await Course.create({
        title,
        subtitle,
        description,
        price,
        level,
        language,
        category: finalCategory._id,
        thumbnail: thumbnail.url,
        instructor: instructorId
    });

    if (!course) {
        throw new ApiError(500, "Failed to create course");
    }

    console.log("Created course:", course);
    return res.status(201)
        .json(new ApiResponse(201, "Course created successfully", course));
});

const updateCourseDetails = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const updatedDetails = req.body;
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this course");
    }
    if (req.body === undefined) {
        throw new ApiError(400, "No data provided for update");
    }
    console.log("Request Body: ", req.body);
    if (updatedDetails.category.description) {
        const category = await Category.findById(course.category);
        if (category) {
            category.description = updatedDetails.category.description;
            await category.save({ withoutValidateBeforeSave: true });
        }
    }

    const allowedFields = [
        "title",
        "subtitle",
        "description",
        "price",
        "level",
        "language",
    ];
    const updatedData = Object.fromEntries(
        Object.entries(updatedDetails).filter(([key, value]) =>
            allowedFields.includes(key) && value !== undefined
        )
    );
    // for (const key in allowedFields) {
    //     if (updatedDetails[allowedFields[key]] !== undefined) {
    //         updatedData[allowedFields[key]] = updatedDetails[allowedFields[key]];
    //     }
    // }
    console.log("Updated Data: ", updatedData);

    const courseUpdated = await Course.findByIdAndUpdate(
        courseId,
        { $set: updatedData },
        { new: true, runValidators: true }
    );
    console.log("Updated Course: ", courseUpdated);
    return res.status(200)
        .json(new ApiResponse(200, "Course updated successfully", courseUpdated));
});


const updateCourseThumbnail = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    if (course.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this course");
    }
    if (!req.file) {
        throw new ApiError(400, "Thumbnail file is required");
    }
    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: { thumbnail: thumbnail.url } },
        { new: true }
    );

    if (!updatedCourse) {
        throw new ApiError(500, "Failed to update course thumbnail");
    }

    return res.status(200)
        .json(new ApiResponse(200, "Course thumbnail updated successfully", updatedCourse));
});

const publishingCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
        .populate("category", "name description")
        .populate("instructor", "fullName isVerified");
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
   console.log("Fetched course for publishing:", course.instructor._id.toString());
   console.log("Current user isVerified:",  course.instructor.isVerified);
   console.log("Current user ID:", req.user._id.toString());
    if (course.instructor._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to publish this course");
    }

    if (course.instructor.isVerified === false) {
        throw new ApiError(403, "Only verified instructors can publish courses");
    }

    if (
        !course?.title?.trim() ||
        !course?.description?.trim() ||
        !course?.thumbnail
    ) {
        throw new ApiError(
            400,
            "Course title, description, and thumbnail are required to publish the course"
        );
    }

    if (course.category.description === "" || course.category.description === null) {
        throw new ApiError(400, "Category description is required to publish the course");
    }


    const sections = await Section.find({ course: courseId }).select("_id");
    if (sections.length === 0) {
        throw new ApiError(
            400,
            "At least one section is required to publish the course"
        );
    }
    const sectionIds = sections.map(section => section._id);

    const lectureExists = await Lecture.exists({
        section: { $in: sectionIds }
    });

    if (!lectureExists) {
        throw new ApiError(
            400,
            "At least one lecture is required to publish the course"
        );
    }

    course.isPublished = "published";
    const updatedCourse = await course.save({ validateBeforeSave: true });
    if (!updatedCourse) {
        throw new ApiError(500, "Failed to publish course");
    }

    await CourseSearch.findOneAndUpdate(
        { courseId: course._id },
        {
            courseId: course._id,
            title: course.title,
            description: course.description,
            instructorName: course.instructor.fullName,
            tags: course.tags || [],
            category: course.category?.name || course.category,
            price: course.price,
            language: course.language,
            level: course.level,
            publishedAt: course.publishedAt
        },
        { upsert: true, new: true }
    );

    return res.status(200)
        .json(new ApiResponse(200, "Course published successfully", updatedCourse));
});

const getCourseDetail = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
        .populate("category", "name description")
        .populate("instructor", "name isVerified");
    console.log("Fetched course:", course);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Course details fetched successfully", course));
});


const listCourses = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        category,
        level,
        price,
        sort
    } = req.query;

    const filter = { isPublished: "published" };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (price === "free") filter.price = 0;
    if (price === "paid") filter.price = { $gt: 0 };

    let sortOption = { createdAt: -1 };
    if (sort === "popular") sortOption = { enrollmentsCount: -1 };
    if (sort === "price-low") sortOption = { price: 1 };

    const courses = await Course.find(filter)
        .select("title price level rating thumbnail instructor")
        .populate("instructor", "name")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res
        .json(new ApiResponse(200, "Courses fetched successfully", courses));
});

const getMyCourses = asyncHandler(async (req, res) => {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId })
        .populate("category", "name description")
        .populate("instructor", "fullName email")
        .sort({ createdAt: -1 });

    if (!courses) {
        throw new ApiError(404, "No courses found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Instructor courses fetched successfully", courses));
});



const searchCourses = async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    console.log("Search query:", q);

    try {
        // Try Atlas Search first
        const results = await CourseSearch.aggregate([
            {
                $search: {
                    index: "course_search_index",
                    text: {
                        query: q,
                        path: ["title", "description", "tags", "instructorName"],
                        fuzzy: {
                            maxEdits: 2
                        }
                    }
                }
            },
            { $sort: { score: { $meta: "searchScore" } } },
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) },
            {
                $project: {
                    title: 1,
                    instructorName: 1,
                    price: 1,
                    level: 1,
                    category: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);

        return res
            .json(new ApiResponse(200, "Search results fetched successfully", results));
    } catch (atlasError) {
        // Fallback to regex search if Atlas Search fails
        console.log("Atlas Search failed, using regex fallback:", atlasError.message);
        
        try {
            const searchRegex = new RegExp(q, "i"); // Case-insensitive regex
            
            const results = await CourseSearch.find({
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { instructorName: { $regex: searchRegex } },
                    { tags: { $regex: searchRegex } }
                ]
            })
            .skip((page - 1) * limit)
            .limit(Number(limit));

            return res
                .json(new ApiResponse(200, "Search results fetched successfully", results));
        } catch (regexError) {
            console.error("Search error:", regexError);
            throw new ApiError(500, "Search failed");
        }
    }
};


const getEnrolledCourses = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ student: studentId })
        .populate({
            path: "course",
            select: "title price level rating thumbnail instructor enrollmentsCount",
            populate: {
                path: "instructor",
                select: "fullName"
            }
        })
        .sort({ enrolledAt: -1 });

    if (!enrollments) {
        throw new ApiError(404, "No enrolled courses found");
    }

    const courses = enrollments.map(enrollment => enrollment.course);

    return res
        .status(200)
        .json(new ApiResponse(200, "Enrolled courses fetched successfully", courses));
});


export {
    createCourse,
    updateCourseDetails,
    updateCourseThumbnail,
    getCourseDetail,
    publishingCourse,
    searchCourses,
    listCourses,
    getMyCourses,
    getEnrolledCourses
};