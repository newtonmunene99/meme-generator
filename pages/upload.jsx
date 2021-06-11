import { useState } from "react";
import Layout from "../components/Layout";
import MediaInput from "../components/MediaInput";
import { isVideo } from "../utils/media";
import { useRouter } from "next/router";

const Upload = () => {
  const router = useRouter();

  /**
   * @type {[File,Function]}
   */
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const acceptedFileExtensions = [".jpg", ".jpeg", ".png", ".mp4"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const formData = new FormData(e.target);

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        return router.push("/");
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
      <form className="container" onSubmit={handleFormSubmit}>
        <MediaInput
          style={{
            height: file ? "100px" : "300px",
            width: "100%",
            border: "solid 2px",
            borderRadius: "2px",
          }}
          accept={acceptedFileExtensions.join(",")}
          multiple={false}
          required
          disabled={loading}
          name="file"
          onChange={(e) => {
            const file = e.target.files[0];

            setFile(file);
          }}
        ></MediaInput>

        <div className="wrapper">
          {file ? (
            <div className="file-wrapper">
              {isVideo(file) ? (
                <div className="video-wrapper">
                  <video src={URL.createObjectURL(file)} controls></video>
                </div>
              ) : (
                <div className="image-wrapper">
                  <img src={URL.createObjectURL(file)} alt="Selected Image" />
                </div>
              )}

              <div className="input-group">
                <label htmlFor="top-text">Top Text</label>
                <input
                  type="text"
                  name="top-text"
                  id="top-text"
                  placeholder="Top text"
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="bottom-text">Bottom Text</label>
                <input
                  type="text"
                  name="bottom-text"
                  id="bottom-text"
                  placeholder="Bottom text"
                  disabled={loading}
                />
              </div>

              <button type="submit" disabled={loading}>
                Generate
              </button>
            </div>
          ) : (
            <div className="no-file-wrapper">
              <h3>No File Yet</h3>
              <p>Select a file to get started</p>
            </div>
          )}
        </div>
      </form>
      <style jsx>{`
        .container {
          min-height: 100vh;
          max-width: 800px;
          background-color: white;
          margin: auto;
          display: flex;
          flex-flow: column nowrap;
          justify-content: start;
          align-items: center;
          padding-top: 32px;
        }

        .wrapper {
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: start;
          align-items: center;
        }

        .wrapper .file-wrapper {
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
        }

        .wrapper .file-wrapper .image-wrapper {
          margin: 40px auto;
        }

        .wrapper .file-wrapper .image-wrapper img {
          width: 100%;
        }

        .wrapper .file-wrapper .video-wrapper {
          margin: 40px auto;
        }

        .wrapper .file-wrapper .video-wrapper video {
          width: 100%;
        }

        .wrapper .input-group {
          display: flex;
          flex-flow: column nowrap;
          margin: 8px auto;
        }

        .wrapper .input-group label {
          font-weight: bold;
        }

        .wrapper .input-group input {
          height: 50px;
          width: 500px;
          padding: 0px 8px;
        }

        .wrapper button {
          height: 50px;
          width: 500px;
          font-weight: bold;
          margin: 8px auto;
        }

        .wrapper button:hover {
          background-color: purple;
          color: white;
          border: none;
        }

        .wrapper .no-file-wrapper {
          background-color: white;
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: start;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export default Upload;
