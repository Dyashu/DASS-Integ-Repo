import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./User.css";
import plus from "./images/SquarePlus.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faEye,
  faCaretRight,
  faCirclePlus
} from "@fortawesome/free-solid-svg-icons";
import ResponsiveAppBar from "./Navbar.js";
import Typography from "@mui/material/Typography";
import Navbar from './Navbar2.js'
// import "bootstrap/dist/css/bootstrap.min.css";

async function fetchPageData(index) {
  try {
    const response = await fetch(`/api/pages/${index.index}`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch page data');
    }
    const pageData = await response.json();
    // console.log(pageData);
    return pageData; // Return the fetched page data
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // Return null or a sensible default in case of error
  }
}


async function handleAddNewClick(index, mainpage, title, navigate) {
  const data = {
    title: title,
    index: index,
    mainpage: mainpage
  };

  try {
    const response = await fetch(`/api/add-new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();

    if (response.ok) {
      if (responseData.newindex !== -1) {
        navigate('/add-new', { state: { responseData } });
      } else {
        alert('A page with the same name already exists.');
      }
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
  }
}

async function handleDeleteClick(index) {
  const data = {
    index: index,
  };

  try {
    const response = await fetch(`/api/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    window.location.reload(); // This will reload the page
    // console.log(responseData);
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
  }
}

function homehandleAddButtonClick(index, mainpage,navigate) {
  const newPageName = prompt('Please enter the name of the new page:');
  if (newPageName) {
    // Assuming you have index, mainpage defined somewhere
    handleAddNewClick(index, mainpage, newPageName,navigate);
  }
}


function WordComponent({ pages, index }) {
  const negivate = useNavigate(); 
  // const [newPageTitle, setNewPageTitle] = useState('');
  const [dropdownStates, setDropdownStates] = useState({});
  const [rotationDegrees, setRotationDegrees] = useState({});
  const [subPages, setsubPages] = useState({}); // Start with null or an empty array
  // console.log(pages);
  if (!Array.isArray(pages)) {
    if (Array.isArray(pages[index])) {
      pages = pages[index];
    }
    else {
      // console.error('Expected pages to be an array but received:', pages);
      return;
    }
  }
  const toggleDropdown = (index) => {
    setDropdownStates({
      ...dropdownStates,
      [index]: !dropdownStates[index],
    });
  };

  const toggleRotation = (index) => {
    setRotationDegrees({
      ...rotationDegrees,
      [index]: rotationDegrees[index] ? 0 : 90,
    });
  };
  const handleViewClick = (index,negivate) => {
    negivate(`/display-publish/${index}`);
  }
  
  const handleEditClick = (index,negivate) => {
    negivate(`/display-save/${index}`);
  }
  const handleAddButtonClick = (index,mainpage,negivate) => {
    const newPageName = prompt('Please enter the name of the new page:');
    if (newPageName) {
      // Assuming you have index, mainpage defined somewhere
      handleAddNewClick(index, mainpage, newPageName,negivate);
    }
  };
  const handleDeleteButtonClick = (index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item and all its contents');
    if (isConfirmed) {
      // Assuming you have a function to handle the actual deletion
      handleDeleteClick(index);
    }
  };

  return (
    <div className="column">
      {pages.map((page) => (
        <>
          <div className="pageBox" key={page.index}>
            <div className="optionButton"
              onClick={async () => {
                toggleDropdown(page.index);
                toggleRotation(page.index);
                setsubPages({
                  ...subPages,
                  [page.index]: await fetchPageData({ index: page.index }),
                });
                // console.log(subPages);
                // setsubPages(await fetchPageData({index: page.index}));
              }}
            >
              <p>
                <FontAwesomeIcon
                  style={{
                    transform: `rotate(${rotationDegrees[page.index] || 0}deg)`,
                    fontSize: "86%",
                  }}
                  icon={faCaretRight} />
              </p>
            </div>
            <div className="pageName">
              <p>{page.title}</p>
            </div>
            <div className="options">
              <div className="optionButton">
                <p>
                  <FontAwesomeIcon icon={faEye} style={{ fontSize: "66%" }}
                  onClick={()=>handleViewClick(page.index,negivate)} />
                </p>
              </div>
              <div className="optionButton">
                <p>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    style={{ fontSize: "66%" }} 
                    onClick={()=>handleEditClick(page.index,negivate)} />
                </p>
              </div>
              <div className="optionButton">
                <p>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    style={{ fontSize: "66%" }}
                    onClick={()=>handleDeleteButtonClick(page.index)} />
                </p>
              </div>
              <div className="optionButton">
                <p>
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    style={{ fontSize: "66%" }}
                    onClick={()=>handleAddButtonClick(page.index,false,negivate)}/>
                </p>
              </div>
            </div>
          </div>
          {(dropdownStates[page.index]) && (subPages) && (
            <div className="subPages">
              <WordComponent
                pages={subPages}
                index={page.index} />
            </div>
          )}
        </>
      ))}
    </div>
  );
}

const ParentComponent = () => {
  const [mainPages, setMainPages] = useState(null); // Start with null or an empty array

  useEffect(() => {
    // Assuming fetchPages is an async function that fetches your pages
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/main-pages');
        const data = await response.json();
        setMainPages(data); // Set the fetched data to state
      } catch (error) {
        console.error('Failed to fetch main pages:', error);
      }
    };

    fetchPages();
  }, []); // The empty array means this effect runs once on mount
  
  // Only render WordComponent if mainPages is not null
  return mainPages ? <WordComponent pages={mainPages} /> : <div>Loading...</div>;
};

function AddNewForm({ setshowForm }) {
  return (
    <div>
      <form action="/api/add-new" method="POST">
        <div style={{ display:'flex' ,padding:'2%', width:'100%'}}>
          <label for="title">Title of page :</label>
          <input id="title" name="title" type="text" required />
        </div>
        <div style={{display:'flex' ,padding:'2%', width:'100%'}}>
          <label for="sub-menu-of">Sub Menu of :</label>
          <input id="sub-menu-of" name="sub-menu-of" type="text" />
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding:'2%'}}>
          <button
            type="submit"
            value="Submit"
          >Submit</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminConfigPage() {
  const [mainPages, setMainPages] = useState(null); // Start with null or an empty array
  // const pages = FetchPagesContent();
  const [showForm, setshowForm] = useState(false);
  // const main_pages = fetchmainpages();
  // let main_pages = findPage({ idS: main_idS, pages });
  const navigate = useNavigate();
  useEffect(() => {
    // Assuming fetchPages is an async function that fetches your pages
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/main-pages');
        const data = await response.json();
        setMainPages(data); // Set the fetched data to state
      } catch (error) {
        console.error('Failed to fetch main pages:', error);
      }
    };

    fetchPages();
  }, []); // The empty array means this effect runs once on mount
  
  return (
    <div style={{ background: "#F6F8F8", minHeight: "100vh" }}>
      {/* <Navigation /> */}
      <Navbar />
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          display: { md: "flex" },
          fontFamily: "monospace",
          padding: "2%",
          fontWeight: 800,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        Pages
      </Typography>
      <div style={{ paddingLeft: "9%", paddingRight: "9%" }}>
        <div className="container-user">
          <div className="content">
            {/* <ParentComponent /> */}
            {mainPages && <WordComponent pages={mainPages}/>}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setshowForm(true)}
              style={{
                fontSize: "large",
                height: "1cm",
                width: "4cm",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
                onClick={()=>homehandleAddButtonClick(0,true,navigate)}
              >
                <img
                  src={plus}
                  alt="Plus"
                  style={{ width: "20%", height: "20%" }}
                />
                Add new
              </div>
            </button>
          </div>
          {/* <div
            style={{ display: "flex", justifyContent: "center", padding: "2%" }}
          >
            {showForm && <AddNewForm setshowForm={setshowForm} />}
          </div> */}
        </div>
      </div>
    </div>
  );
}
