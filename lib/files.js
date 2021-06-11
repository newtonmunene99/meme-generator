import { IncomingForm, Fields, Files } from "formidable";
import cloudinary from "../utils/cloudinary";
import { isVideo } from "../utils/media";

const FOLDER_NAME = "memes";

/**
 * Get cloudinary uploads in the `memes` folder based on resource type
 * @param {"image"|"video"} resource_type
 * @returns {Promise}
 */
export const handleGetCloudinaryUploads = (resource_type) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources(
      {
        type: "upload",
        prefix: FOLDER_NAME,
        resource_type,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );
  });
};

/**
 * Uploads a file to cloudinary
 * @param {File} file
 * @param {{topText:string;bottomText:string}} options
 * @returns
 */
export const handleCloudinaryUpload = (file, { topText, bottomText }) => {
  return new Promise((resolve, reject) => {
    const fileIsVideo = isVideo(file);

    cloudinary.uploader.upload(
      file.path,
      {
        // Folder to store resource in
        folder: `${FOLDER_NAME}/`,
        // Tags that describe the resource
        tags: ["memes"],
        // Type of resource. We leave it to cloudinary to determine but on the front end we only allow images and videos
        resource_type: "auto",
        // Only allow these formats
        allowed_formats: ["jpg", "jpeg", "png", "mp4"],

        // Array of transformations/manipulation that will be applied to the image by default
        transformation: [
          /// We're going to pad the resource to an aspect ratio of 16:9.
          {
            background: "auto",
            crop: "pad",
            aspect_ratio: "16:9",
          },
          // If the file is a video
          ...(fileIsVideo
            ? [
                { format: "gif" },
                {
                  effect: "loop:3",
                },
              ]
            : []),
          // If top text is not null
          ...(topText
            ? [
                {
                  // Align the text layer towards the top
                  gravity: "north",
                  // Space of 5% from the top
                  y: "0.05",
                  // Text stroke/border
                  border: "10px_solid_black",
                  // Text color
                  color: "white",
                  overlay: {
                    font_family: "Arial",
                    font_size: topText.length <= 20 ? 50 : 40,
                    font_weight: "bold",
                    font_style: "italic",
                    stroke: "stroke",
                    letter_spacing: 10,
                    text: topText,
                  },
                },
              ]
            : []),
          // If bottom text is not null
          ...(bottomText
            ? [
                {
                  // Align the text layer towards the bottom
                  gravity: "south",
                  // Space of 5% from the bottom
                  y: "0.05",
                  // Text stroke/border
                  border: "10px_solid_black",
                  // Text color
                  color: "white",
                  overlay: {
                    font_family: "Arial",
                    font_size: bottomText.length <= 20 ? 50 : 40,
                    font_weight: "bold",
                    font_style: "italic",
                    stroke: "stroke",
                    letter_spacing: 10,
                    text: bottomText,
                  },
                },
              ]
            : []),
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );
  });
};

/**
 *
 * @param {string[]} ids - Array of Public IDs of resources to delete
 * @param {"image"|"video"} type - Type of resources
 * @returns
 */
export const handleCloudinaryDelete = async (ids, type) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      ids,
      {
        resource_type: type,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );
  });
};

/**
 *
 * @param {*} req
 * @returns {Promise<{ fields:Fields; files:Files; }>}
 */
export const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
