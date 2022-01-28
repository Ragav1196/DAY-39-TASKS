import express, { response } from "express";
import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 9000;
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo DB connected");
  return client;
}

const client = await createConnection();

app.get("/data", async (req, res) => {
  const DataFrmDb = await client
    .db("session39")
    .collection("data")
    .find()
    .toArray();
  CreateFolders(DataFrmDb);
  res.send(DataFrmDb);
});

function CreateFolders(DataFrmDb) {
  DataFrmDb.map(({ Notes, Tasks }) => {
    for (let i = 1; i < 10; i++) {
      if (Notes) {
        try {
          if (!fs.existsSync(`${Notes[0].folderName}/Session-${i}`)) {
            fs.mkdirSync(`${Notes[0].folderName}/Session-${i}`, {
              recursive: true,
            });
            fs.writeFile(
              `${Notes[0].folderName}/Session-${i}/${Notes[1].fileName}`,
              Notes[2].content,
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        } catch (err) {
          console.log(err);
        }
      }
      if (Tasks) {
        try {
          if (!fs.existsSync(`${Tasks[0].folderName}/Session-${i}`)) {
            fs.mkdirSync(`${Tasks[0].folderName}/Session-${i}`, {
              recursive: true,
            });
            fs.writeFile(
              `${Tasks[0].folderName}/Session-${i}/${Tasks[1].fileName}`,
              Tasks[2].content,
              (err) => (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

// TO READ FILES AND FOLDERS INSIDE THE DIRECTORY
if (fs.existsSync("./Guvi/Tasks")) {
  fs.readdir("./Guvi/Tasks", (err, files) => {
    var FolderContens = "";
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      FolderContens += file + ", ";
    });
    console.log(`SUBFOLDERS OF THE PROVIDED PATH IS => ${FolderContens}`);
  });
}

// TO READ FILE EXTENSION
if (fs.existsSync("./Guvi/Notes/Session-1")) {
  fs.readdir("./Guvi/Notes/Session-1", (err, files) => {
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      console.log(`EXTENSION OF THE SELECTED FILE IS => ${path.extname(file)}`);
    });
  });
}

app.listen(PORT, () => console.log("App is started in", PORT));

// EMBEDDED DOCUMENT STORED IN DATABASE WHICH IS USED FOR THIS TASK:

// [
//   {
//     Notes: [
//       { folderName: "./Guvi/Notes" },
//       { fileName: "index.js" },
//       { content: 'console.log("Hello World")' },
//     ],
//   },
//   {
//     Tasks: [
//       { folderName: "./Guvi/Tasks" },
//       { fileName: "index.js" },
//       { content: 'console.log("Hello World")' },
//     ],
//   },
// ];
