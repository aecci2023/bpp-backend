const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

const S3 = new AWS.S3({
    signatureVersion: "v4",
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGIONBUCKET,
    apiVersion: "latest",
});

const uploadToS3Bucket = async (folderName = "", fileName, file, type) => {
    let random = new Date().getTime();

    //UPDATED FOR BETTER FILE CONFIGURATION
    fileName = folderName + "/" + random + fileName;

    return new Promise((resolve, reject) => {
        S3.upload(
            {
                Key: fileName,
                Bucket: process.env.BUCKET,
                Body: file,
                ContentType: type,
            },
            (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            }
        );
    });
};


module.exports = {
    uploadToS3Bucket
}