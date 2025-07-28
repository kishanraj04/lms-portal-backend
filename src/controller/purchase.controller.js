import Stripe from "stripe";
import { Course } from "../models/Course.model.js";
import { Purchase } from "../models/Purchase.mode.js";
import { User } from "../models/User.model.js";
import { Lecture } from "../models/Lecture.model.js"; // ✅ Make sure this exists

const stripe = new Stripe(process.env.PUBLISHABLE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { email } = req?.user;
    const { courseId } = req.body;

    const usr = await User.findOne({ email });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new Purchase({
      courseId,
      userId: usr?._id,
      amount: course?.price,
      paymentStatus: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course?.title,
              images: [course?.thumbnail?.url],
            },
            unit_amount: Math.round(course?.price * 100), // Ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`,
      cancel_url: `http://localhost:5173/coursedetail/${courseId}`,
      metadata: {
        courseId: String(courseId),
        userId: String(usr?._id), // ✅ convert ObjectId to string
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res.status(400).json({ success: false, message: "Error while creating session" });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;
  let event;
  try {
    // ✅ Construct event from raw body buffer
    event = stripe.webhooks.constructEvent(req.body, signature,endpointSecret);
    console.log("✅ Event verified:", event.type);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ Only act on completed checkout sessions
  if (event.type === "checkout.session.completed") {
    console.log("✅ Event: checkout.session.completed");

    const session = event.data.object;

    try {
      const purchase = await Purchase.findOne({ paymentId: session.id }).populate("courseId");

      if (!purchase) {
        console.warn(`❌ No purchase found for session.id: ${session.id}`);
        return res.status(404).end();
      }

      // ✅ Update amount and status
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.paymentStatus = "completed"; // Must match enum exactly
      await purchase.save();

      // ✅ Unlock lectures
      if (purchase?.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isFree: true } }
        );
      }

      // ✅ Add user to course + course to user
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolled: purchase.courseId._id } }
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }
      );

      console.log("✅ Purchase completed and data updated");
    } catch (err) {
      console.error("❌ Error handling webhook logic:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // ✅ Always respond to Stripe (to stop retries)
  res.status(200).end();
};


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    const purchased = await Purchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await Purchase.find({ paymentStatus: "completed" }).populate("courseId");

    return res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};