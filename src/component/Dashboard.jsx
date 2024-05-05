import React, {  useEffect, useState } from "react";
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
import {  Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [jobData, setJobData] = useState([]);
  const [showMore, setShowMore] = useState({});

  const toggleShowMore = (jdUid) => {
  setShowMore((prevMap) => ({
    ...prevMap,
    [jdUid]: !prevMap[jdUid], // Toggle the value for the specified jdUid
  }));
};

  const getUserDatavalue = useSelector((x) => x.getUser);
  console.log(getUserDatavalue);

  useEffect(() => {
    if (getUserDatavalue.response) {
      console.log(getUserDatavalue.response);
      const newData = getUserDatavalue.response?.jdList || [];
      setJobData([...jobData, ...newData]);
      setHasMore(newData.length > 0);
      setPage(page + 1);
      setIsLoading(false);
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

  const filteredData = jobData.filter((value) => {
    if (
      value.companyName?.toLowerCase().includes(search?.toLowerCase()) ||
      value.jobRole?.toLowerCase().includes(search?.toLowerCase()) ||
      value.minExp?.toString().toLowerCase().includes(search?.toLowerCase()) ||
      value.location?.toLowerCase().includes(search?.toLowerCase()) ||
      value.minJdSalary
        ?.toString()
        .toLowerCase()
        .includes(search?.toLowerCase())
    )
      return true;
  });

  const searchInfo = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor="grouped-native-select">Roles</InputLabel>
        <Select
          native
          defaultValue=""
          id="grouped-native-select"
          label="Roles"
          onChange={searchInfo}
        >
          <option aria-label="None" value="" />
          {[...new Set(jobData.map((job) => job.jobRole))]
            .filter((exp) => exp !== null)
            .sort((a, b) => a - b) // Sort in ascending order
            .map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
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
          onChange={searchInfo}
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
        <InputLabel htmlFor="grouped-native-select">Location</InputLabel>
        <Select
          native
          defaultValue=""
          id="grouped-native-select"
          label="Location"
          onChange={searchInfo}
        >
          <option aria-label="None" value="" />
          {[...new Set(jobData.map((job) => job.location))]
            .filter((exp) => exp !== null)
            .sort((a, b) => a - b) // Sort in ascending order
            .map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
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
          onChange={searchInfo}
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
          onChange={searchInfo}
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
    <Button onClick={() => toggleShowMore(job.jdUid)} color="primary">
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
