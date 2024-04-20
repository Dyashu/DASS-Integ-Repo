import React, { useState, useEffect } from "react";
import "./NewsPage.css"; // Import CSS file for styling
import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";
import image5 from "./5.png";
import image6 from "./6.png";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import Footer from "./Footer.js";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

Quill.register("modules/imageResize", ImageResize);
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // [{ align:[ '', 'left', 'center', 'right', 'justify']}]
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ], // Alignment options
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

function NewsPage() {
  const [newsItems, setnewsItems] = useState([]);
  const fetchedItems = [
    {
      title: "Tech Summit 2024",
      content:
        "Join us for the annual Tech Summit where industry leaders discuss the latest trends and innovations.",
      link: "https://techsummit.com",
      image: image1, // Add image URL for the event
      isdone: true,
      date: "21-04-24",
    },
    {
      title: "Web Development Workshop",
      content:
        "Learn the fundamentals of web development in this hands-on workshop. No prior experience required!",
      link: "https://webdevworkshop.com",
      image: image2, // Add image URL for the event
      isdone: true,
      date: "24-01-24",
    },
    {
      title: "Data Science Conference",
      content:
        "Explore the world of data science with talks and workshops from leading experts in the field.",
      link: "https://datascienceconference.com",
      image: image3, // Add image URL for the event
      isdone: true,
      date: "26-03-22",
    },
    // Add some additional events
    {
      title: "Mobile App Development Bootcamp",
      content:
        "Get started with mobile app development and build your first app from scratch.",
      link: "https://mobileappbootcamp.com",
      image: image4, // Add image URL for the event
      isdone: true,
      date: "22-05-24",
    },
    {
      title: "AI & Machine Learning Summit",
      content:
        "Discover the latest advancements in artificial intelligence and machine learning technologies.",
      link: "https://aiandmlsummit.com",
      image: image5, // Add image URL for the event
      isdone: true,
      date: "23-05-24",
    },
  ];
  // Array of news items

  useEffect(() => {
    setnewsItems(fetchedItems);
    // eslint-disable-next-line
  }, []);

  const [editStates, seteditStates] = useState(
    Array.from({ length: fetchedItems.length }, () => ({
      editImage: false,
      editText: false,
    }))
  );

  const handlestateChange = (attribute, value, index) => {
    const newStates = [...editStates];
    newStates[index] = { ...editStates[index], [attribute]: value };
    seteditStates(newStates);
  };

  async function uploadImageFunction(image) {
    try {
      const formData = new FormData();
      formData.append("image_name_in_form", image);

      const response = await fetch(`/api/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      } else {
        const responseData = await response.json();
        return responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handlechangeImage = async (e, index, item) => {
    const newItems = [...newsItems];
    const files = e.target.files;
    console.log(index);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const res = await uploadImageFunction(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newItems[index] = {
            ...item,
            image: "../" + res.imagepath,
          };
          setnewsItems([...newItems]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  function DisplayText({ item, index }) {
    const [textContent, setTextContent] = useState(item.content || "");
    const [titleContent, setTitleContent] = useState(item.title || "");
    const [linkContent, setlinkContent] = useState(item.link || "");
    const [dateContent, setdateContent] = useState(item.date || "");

    const handleTitleChange = (event) => {
      setTitleContent(event.target.value);
    };

    const handlelinkChange = (event) => {
      setlinkContent(event.target.value);
    };
    const handledateChange = (event) => {
      setdateContent(event.target.value);
    };

    const handleTextChange = (value) => {
      setTextContent(value);
    };

    const handleChangesDone = () => {
      const newItems = [...newsItems];
      newItems[index] = {
        ...item,
        content: textContent,
        title: titleContent,
        link: linkContent,
        isdone: true,
      };
      setnewsItems(newItems);
    };

    return (
      <>
        {item.isdone ? (
          <>
            <a href={item.link}>
              <div className="title">{item.title}</div>
            </a>
            <div
              className="ql-editor"
              style={{
                height: "auto",
                marginBottom: "15px",
                fontSize: "1.5vw",
                padding: "0",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: textContent }} />
            </div>
            <div className="EventsDate">Date : {item.date}</div>
            <a
              href={item.link}
              target="_self"
              rel="noopener noreferrer"
              className="link"
              style={{ textDecoration: "underline", color: "blue" }}
            >
              Read More...
            </a>
          </>
        ) : (
          <>
            <input
              type="text"
              className="InputField_1"
              value={titleContent}
              onChange={(e) => handleTitleChange(e)}
            />
            <div className="textContainer" key={index}>
              <ReactQuill
                value={textContent}
                onChange={handleTextChange}
                modules={modules}
                // placeholder="Type your Text Here.."
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", width: "35%" }}>
                <p style={{ fontWeight: "bold" }}> Date : </p>
                <input
                  type="text"
                  className="InputField_1"
                  style={{
                    width: "40%",
                    fontSize: "initial",
                    fontWeight: "normal",
                    marginLeft: "3%",
                  }}
                  value={dateContent}
                  onChange={(e) => handledateChange(e)}
                />
              </div>
              <div style={{ display: "flex", width: "35%" }}>
                <p style={{ fontWeight: "bold" }}> Link : </p>
                <input
                  type="text"
                  className="InputField_1"
                  style={{
                    width: "78%",
                    fontSize: "initial",
                    fontWeight: "normal",
                    marginLeft: "3%",
                  }}
                  value={linkContent}
                  onChange={(e) => handlelinkChange(e)}
                />
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "1vh" }}>
              <Button
                variant="contained"
                sx={{ width: "10vw", fontSize: "1vw" }}
                onClick={handleChangesDone}
              >
                Done
              </Button>
            </div>
          </>
        )}
      </>
    );
  }

  const handleTextEdit = (item, index) => {
    const newItems = [...newsItems];
    newItems[index] = { ...item, isdone: false };
    setnewsItems(newItems);
  };

  const handledelete = (item, index) => {
    const newItems = [...newsItems];
    const before = newItems.slice(0, index);
    const after = newItems.slice(index + 1);
    setnewsItems([...before, ...after]);
  };

  const [openModal, setOpenModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewsTitle("");
    setNewsContent("");
    setNewsImage(null);
  };

  const handleNewsTitleChange = (event) => {
    setNewsTitle(event.target.value);
  };

  const handleNewsContentChange = (event) => {
    setNewsContent(event.target.value);
  };

  const handleNewsImageChange = (event) => {
    const file = event.target.files[0]; // Get the first file from the input
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target.result; // Base64 encoded image data
      setNewsImage(imageData); // Update the state with the image data
    };

    // Read the file as a data URL (base64 encoded)
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log("News Title:", newsTitle);
    console.log("News Content:", newsContent);
    console.log("News Image:", newsImage);
    handleCloseModal();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <div className="container_news">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="Heading">Events</div>
          <div className="Add-Publish">
            <Button
              variant="contained"
              sx={{ width: "10vw", mb: "1%", mt: "1%", fontSize: "1vw" }}
              onClick={handleOpenModal}
            >
              Add News
            </Button>
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box sx={style}>
                <Typography variant="h6" component="h2">
                  Add News
                </Typography>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={newsTitle}
                  onChange={handleNewsTitleChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Content"
                  variant="outlined"
                  value={newsContent}
                  onChange={handleNewsContentChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mt: 2 }}
                />
                <Input
                  type="file"
                  onChange={handleNewsImageChange}
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Modal>
            <Button
              variant="contained"
              sx={{ width: "10vw", mb: "1%", mt: "1%", fontSize: "1vw" }}
              className="PublishNews"
            >
              Publish
            </Button>
          </div>
        </div>
        {newsItems.map((item, index) => (
          <div
            className="news"
            key={index}
            onMouseEnter={() => handlestateChange("editText", true, index)}
            onMouseLeave={() => handlestateChange("editText", false, index)}
          >
            <input
              id={`TakeimageInput_${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handlechangeImage(e, index, item)}
              multiple
              style={{ display: "none" }}
            />
            <div
              className="ImageContainer"
              onMouseEnter={() => handlestateChange("editImage", true, index)}
              onMouseLeave={() => handlestateChange("editImage", false, index)}
            >
              <img
                src={item.image}
                alt="Newsimage"
                className={
                  editStates[index].editImage ? "HoveredNewsImage" : "NewsImage"
                }
              />
              {editStates[index].editImage && (
                <div
                  className="edit-icon"
                  onClick={() =>
                    document.getElementById(`TakeimageInput_${index}`).click()
                  }
                >
                  <AddPhotoAlternateIcon color="black" />
                </div>
              )}
            </div>
            <div className="NewsContent">
              <DisplayText item={item} index={index} />
              {editStates[index].editText && item.isdone && (
                <>
                  <div
                    className="edit_content"
                    onClick={() => handleTextEdit(item, index)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} size="xl" />
                  </div>
                  <div
                    className="delete_content"
                    onClick={() => handledelete(item, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="xl" />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

export default NewsPage;
