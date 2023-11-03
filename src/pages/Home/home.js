import React, { useEffect, useState, useContext } from "react";

import searchIcon from "../../assets/images/icons/search1.png";

import Slider from "../../components/slider";
import { UserContext } from "../../App";
import C2eAccordion from "./c2eAccordion";
import { Alert } from "react-bootstrap";

const Home = () => {
  const user = useContext(UserContext);

  const [apiProject, setapiProject] = useState();
  const [apiProject1, setapiProject1] = useState();

  const [query, setQuery] = useState("");

  const [searchData, setSearchData] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const listProjects = async () => {
    const allProjects = await fetch(apiBaseUrl + "c2e-licenses/buyer", {
      method: "POST",
      body: JSON.stringify({ token: localStorage.getItem("oAuthToken") }),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const result = await allProjects.json();

    setapiProject(result);
    setSearchData(result);
  };

  useEffect(() => {
    listProjects();
  }, []);

  useEffect(() => {
    if (query === "") {
      setSearchData(apiProject1);
    }
  }, [apiProject1, query]);

  const handleSearchClick = () => {
    const filteredData = apiProject1?.filter((item) => {
      return (
        item?.cee?.title?.toLowerCase().includes(query.toLowerCase()) ||
        item?.cee?.subjectOf?.toLowerCase().includes(query.toLowerCase()) ||
        item?.cee?.description?.toLowerCase().includes(query.toLowerCase())
      );
    });
    setSearchData(filteredData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  //sort
  useEffect(() => {
    if (apiProject?.length) {
      apiProject?.sort((a, b) => {
        if (a.cee.subjectOf < b.cee.subjectOf) return -1;
        if (a.cee.subjectOf > b.cee.subjectOf) return 1;
        // If "subjectOf" is the same, sort by "title"
        if (a.cee.title < b.cee.title) return -1;
        if (a.cee.title > b.cee.title) return 1;
        return 0;
      });

      // Iterate through the sorted array and group chapters under their respective books
      setapiProject1(apiProject);
    }
  }, [apiProject]);

  return (
    <>
      {/* <Slider /> */}
      <br />

      <div className="main-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="heading">
            <h3>
              <span>Hello,</span>

              <br />
              {user.name}
            </h3>
          </div>
          <div className="search-wrapper">
            <input type="text" placeholder="Search" onChange={(e) => setQuery(e.target.value)} value={query} onKeyPress={handleKeyPress} />
            <button onClick={handleSearchClick} className="search-icon">
              <img src={searchIcon} alt="search" />
            </button>
          </div>
        </div>

        <h4 className="sub-heading">My C2E’s</h4>

        <br />

        {searchData?.length <= 0 ? <Alert variant="warning">no result found.</Alert> : <C2eAccordion bookData={searchData} />}
        <br />
      </div>
    </>
  );
};

export default Home;
