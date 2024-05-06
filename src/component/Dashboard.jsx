import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../state/action/DashboardAction";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, MenuItem, TextField } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [jobData, setJobData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMore, setShowMore] = useState({});
  const [roleFilter, setRoleFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const getUserDatavalue = useSelector((x) => x.getUser);
  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleExpChange = (e) => {
    setExpFilter(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleSalaryChange = (e) => {
    setSalaryFilter(e.target.value);
  };

  const handleCompanySearch = (e) => {
    setCompanySearch(e.target.value);
  };

  const applyFilters = () => {
    const filtered = jobData.filter((job) => {
      const companyMatch = job.companyName
        .toLowerCase()
        .includes(companySearch.toLowerCase());
      const roleMatch =
        roleFilter === "" ||
        job.jobRole.toLowerCase().includes(roleFilter.toLowerCase());
        const expMatch =
        expFilter === "" ||
        (typeof expFilter === 'string' &&
          job.minExp &&
          job.minExp
            .toString()
            .toLowerCase()
            .includes(expFilter.toLowerCase()));
      
      const locationMatch =
        locationFilter === "" ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const salaryMatch =
        salaryFilter === "" ||
        (job.minJdSalary &&
          job.minJdSalary
            .toString()
            .toLowerCase()
            .includes(salaryFilter.toLowerCase()));

      return (
        companyMatch && roleMatch && expMatch && locationMatch && salaryMatch
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [
    companySearch,
    roleFilter,
    expFilter,
    locationFilter,
    salaryFilter,
    jobData,
  ]);

  const toggleShowMore = (jdUid) => {
    setShowMore((prevMap) => ({
      ...prevMap,
      [jdUid]: !prevMap[jdUid],
    }));
  };

 

  useEffect(() => {
    if (getUserDatavalue.response) {
      // console.log(getUserDatavalue.response);
      const newData = getUserDatavalue.response?.jdList || [];
      setJobData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length > 0);
      setPage(page + 1);
   
    }
  }, [getUserDatavalue]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await dispatch(getUserData(page));
      const newData = response?.data?.response?.jdList || [];
      setJobData([...jobData, ...newData]);
      setHasMore(newData.length > 0);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Roles</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={roleFilter}
          label="Roles"
          onChange={handleRoleChange}
        >
          {[...new Set(jobData.map((job) => job.jobRole))]
            .filter((exp) => exp !== null)
            .sort((a, b) => a - b) // Sort in ascending order
            .map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel htmlFor="grouped-native-select">Experience</InputLabel>
      <Select
        native
        defaultValue=""
        id="grouped-native-select"
        label="Experience"
        onChange={handleExpChange}
      >
        <option aria-label="None" value="" />
        {[...new Set(jobData.map((job) => job.minExp))]
          .filter((exp) => exp !== null)
          .sort((a, b) => a - b) // Sort in ascending order
          .map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
      </Select>
    </FormControl>
    

      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-label">Location</InputLabel>
        <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={locationFilter}
     
        
          
         
          label="Location"
          onChange={handleLocationChange}
        >
        
          {[...new Set(jobData.map((job) => job.location))]
            .filter((exp) => exp !== null)
            .sort((a, b) => a - b) // Sort in ascending order
            .map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 240 }}>
        <InputLabel htmlFor="grouped-native-select">
          Minimum Base Pay Salary
        </InputLabel>
        <Select
          native
          defaultValue=""
          id="grouped-native-select"
          label="Minimum Base Pay Salary"
          onChange={handleSalaryChange}
        >
          <option aria-label="None" value="" />
          {[...new Set(jobData.map((job) => job.minJdSalary))]
            .filter((exp) => exp !== null)
            .sort((a, b) => a - b) // Sort in ascending order
            .map((pay) => (
              <option key={pay} value={pay}>
                {pay}
              </option>
            ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <TextField
          id="outlined-basic"
          label="Search Company"
          variant="outlined"
          onChange={handleCompanySearch}
        />
      </FormControl>
      <>
        <InfiniteScroll
          dataLength={jobData.length}
          next={loadJobs}
          hasMore={hasMore}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {filteredData.map((job) => (
              <Card key={job.jdUid} sx={{ maxWidth: 345, margin: "20px auto" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={job.logoUrl}
                  alt={job.companyName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {job.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {job.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job Role: {job.jobRole}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Salary:{" "}
                    {job.minJdSalary && job.maxJdSalary
                      ? `$${job.minJdSalary} - $${job.maxJdSalary}`
                      : "Salary not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <span style={{ fontWeight: "bold", color: "#000000" }}>
                      About Company:
                    </span>
                    {showMore[job.jdUid]
                      ? job.jobDetailsFromCompany
                      : `${job.jobDetailsFromCompany.slice(0, 100)}...`}
                  </Typography>
                  {job.jobDetailsFromCompany.length > 100 && (
                    <Button
                      onClick={() => toggleShowMore(job.jdUid)}
                      color="primary"
                    >
                      {showMore[job.jdUid] ? "Show Less" : "Show More"}
                    </Button>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    Experience:{" "}
                    {job.minExp && job.maxExp
                      ? `${job.minExp} - ${job.maxExp} years`
                      : "Experience not specified"}
                  </Typography>
                  <Button sx={{ backgroundColor: "#1de9b6" }}>
                    <Link
                      to={job.jdLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#000000" }}
                    >
                      Easy Apply
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </InfiniteScroll>
      </>
    </div>
  );
}
