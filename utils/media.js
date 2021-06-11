/**
 * Checks if a file is a video or not by checking if the `type` field ends with mp4
 * @param {File} file
 * @returns {boolean}
 */
export const isVideo = (file) => {
  return file.type.endsWith("mp4");
};
