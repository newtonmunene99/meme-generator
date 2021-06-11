// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  handleCloudinaryDelete,
  handleCloudinaryUpload,
  handleGetCloudinaryUploads,
  parseForm,
} from "../../lib/files";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  switch (req.method) {
    case "GET": {
      try {
        const { type } = req.query;

        if (!type) {
          throw "type param is required";
        }

        const result = await handleGetRequest(type);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }
    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }
    case "DELETE": {
      try {
        const { type, id } = req.query;

        if (!id || !type) {
          throw "id and type params are required";
        }

        const result = await handleDeleteRequest(id, type);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }
    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
};

const handleGetRequest = async (type) => {
  const result = await handleGetCloudinaryUploads(type);

  return result;
};

const handlePostRequest = async (req) => {
  const data = await parseForm(req);

  const result = await handleCloudinaryUpload(data?.files?.file, {
    topText: data?.fields?.["top-text"],
    bottomText: data?.fields?.["bottom-text"],
  });

  return result;
};

const handleDeleteRequest = async (id, type) => {
  const result = await handleCloudinaryDelete([id], type);

  return result;
};
