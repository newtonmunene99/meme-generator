import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import { isVideo } from "../utils/media";

export default function Home() {
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      const [imagesResponse, videosResponse] = await Promise.all([
        fetch("/api/files/?type=image", {
          method: "GET",
        }),
        fetch("/api/files/?type=video", {
          method: "GET",
        }),
      ]);

      const [imagesData, videosData] = await Promise.all([
        imagesResponse.json(),
        videosResponse.json(),
      ]);

      let allResources = [];

      if (imagesResponse.status >= 200 && imagesResponse.status < 300) {
        allResources = [...allResources, ...imagesData.result.resources];
      } else {
        throw data;
      }

      if (videosResponse.status >= 200 && videosResponse.status < 300) {
        allResources = [...allResources, ...videosData.result.resources];
      } else {
        throw data;
      }

      setResources(allResources);
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    }
  };

  const handleDownloadResource = async (resourceUrl, assetId, format) => {
    try {
      setLoading(true);
      const response = await fetch(resourceUrl, {});

      if (response.status >= 200 && response.status < 300) {
        const blob = await response.blob();

        const fileUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `${assetId}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      throw await response.json();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id, type) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files/?id=${id}&type=${type}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        return refresh();
      }

      throw data;
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="main">
        {resources.length} Resources Uploaded
        <div className="resources-wrapper">
          {resources.map((resource, index) => {
            const isVideo = resource.resource_type === "video";

            let resourceUrl = resource.secure_url;

            if (isVideo) {
              resourceUrl = resource.secure_url.replace(".mp4", ".gif");
            }

            return (
              <div className="resource-wrapper" key={index}>
                <div className="resource">
                  <Image
                    className="image"
                    src={resourceUrl}
                    layout="responsive"
                    alt={resourceUrl}
                    width={resource.width}
                    height={resource.height}
                  ></Image>
                </div>

                <div className="actions">
                  <button
                    disabled={loading}
                    onClick={() => {
                      handleDownloadResource(
                        resourceUrl,
                        resource.asset_id,
                        isVideo ? "gif" : resource.format
                      );
                    }}
                  >
                    Download
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      handleDeleteResource(
                        resource.public_id,
                        isVideo ? "video" : "image"
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .main {
          max-width: 800px;
          min-height: 100vh;
          margin: 0 auto;
          display: flex;
          flex-flow: column;
          justify-content: start;
          align-items: center;
        }

        .resources-wrapper {
          display: flex;
          flex-flow: column nowrap;
          gap: 16px;
          width: 100%;
        }

        .resources-wrapper .resource-wrapper {
          flex: 1 0 300px;
          min-width: 300px;
          border: solid 2px black;
        }

        .resources-wrapper .resource-wrapper .resource {
          width: 100%;
          height: 70%;
        }

        .resources-wrapper .resource-wrapper .actions {
          width: 100%;
          padding: 8px;
          display: flex;
          justify-content: center;
        }

        .resources-wrapper .resource-wrapper .actions button {
          height: 50px;
          min-width: 150px;
          margin: 8px;
          font-weight: bold;
        }
      `}</style>
    </Layout>
  );
}
