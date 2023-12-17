import { ObjectId } from "mongodb";
import { apartments, reviews } from "../configs/mongoCollection.js";

export const createReview = async (
  posterId,
  apartmentId,
  rating,
  content,
  datePosted,
  isApproved
) => {
  const review = {
    posterId: posterId,
    apartmentId: apartmentId,
    rating: rating,
    content: content,
    datePosted: datePosted,
    isApproved: false,
  };
  const reviewCollection = await reviews();
  const output = await reviewCollection.insertOne(review);
  if (!output.acknowledged || !output.insertedId) {
    throw "Review was not inserted into database";
  }
};

export async function updateReviewInfoById(
  id,
  posterId,
  apartmentId,
  rating,
  content,
  datePosted,
  isApproved
) {
  const updateInfo = {};
  const parameterNames = getParameterNames(updateReviewInfoById).slice(1);
  const parameterValues =
    getParameterValueArrayFromArguments(arguments).slice(1);

  //TODO: Add parameter validation
  for (let i = 0; i < parameterNames.length; i++) {
    if (!parameterValues[i]) {
      continue;
    }
    updateInfo[parameterNames[i]] = parameterValues[i];
  }

  const reviewCollection = await reviews();
  const result = await reviewCollection.updateOne(getIdFilter(id), {
    $set: updateInfo,
  });
  if (result.modifiedCount !== 1) {
    throw `No review exists with id ${id}`;
  }
}

export const getReviewById = async (id) => {
  const reviewCollection = await reviews();
  const review = await reviewCollection.findOne(getIdFilter(id));
  return formatReviewObject(review);
};

export const deleteReviewById = async (id) => {
  const reviewCollection = await reviews();
  const result = await reviewCollection.deleteOne(getIdFilter(id));
  if (result.deletedCount !== 1) {
    throw `No review exists with id ${id}`;
  }
};

export const approveReviewById = async (id) => {
  const reviewCollection = await reviews();
  const updateInfo = { $set: { isApproved: true } };
  const result = await reviewCollection.updateOne(getIdFilter(id), updateInfo);
  if (result.modifiedCount !== 1) {
    throw `No review exists with id ${id}`;
  }
};

export const getAllReviewsByPosterId = async (posterId) => {
  const reviewCollection = await reviews();
  const reviewList = await reviewCollection
    .find({ posterId: posterId })
    .toArray();
  for (let i = 0; i < reviewList.length; i++) {
    formatReviewObject(reviewList[i]);
  }
  return reviewList;
};

export const getAllReviewsByApartmentId = async (apartmentId) => {
  const reviewCollection = await reviews();
  const reviewList = await reviewCollection
    .find({ apartmentId: apartmentId })
    .toArray();
  for (let i = 0; i < reviewList.length; i++) {
    formatReviewObject(reviewList[i]);
  }
  return reviewList;
};

export const getAllReviews = async () => {
  const reviewCollection = await reviews();
  const allReviews = await reviewCollection.find({}).toArray();
  for (let i = 0; i < allReviews.length; i++) {
    formatReviewObject(allReviews[i]);
  }
  return allReviews;
};

export const getAllReviewsPendingApproval = async () => {
  const reviewCollection = await reviews();
  const reviewList = await reviewCollection
    .find({ isApproved: false })
    .toArray();
  for (let i = 0; i < reviewList.length; i++) {
    formatReviewObject(reviewList[i]);
  }
  return reviewList;
};

export const getAllApprovedReviews = async () => {
  const reviewCollection = await reviews();
  const reviewList = await reviewCollection
    .find({ isApproved: true })
    .toArray();
  for (let i = 0; i < reviewList.length; i++) {
    formatReviewObject(reviewList[i]);
  }
  return reviewList;
};

const getIdFilter = async (id) => {
  return { _id: new ObjectId(id) };
};

const formatReviewObject = async (reviewObject) => {
  delete reviewObject.password;
  å;
  reviewObject._id = reviewObject._id.toString();
  return reviewObject;
};

const getParameterNames = (func) => {
  const str = func.toString();
  const paramName = str
    .slice(str.indexOf("(") + 1, str.indexOf(")"))
    .match(/([^\s,]+)/g);
  return paramName || [];
};

const getParameterValueArrayFromArguments = (args) => {
  const output = [];
  const keys = Object.keys(args);
  for (let i = 0; i < keys.length; i++) {
    output.push(args[keys[i]]);
  }
  return output;
};
