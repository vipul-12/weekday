import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./App.css";
import axios, { AxiosResponse } from "axios";
import JobCard from "./components/JobCard";
import styled from "styled-components";

const StyledApp = styled.div`
  .grid {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    // overflow: auto;
    // height: 400px;
  }

  .column {
    flex: 0 0 33.33%;
    padding: 1rem;
    box-sizing: border-box;
    max-width: 33.33%;
  }

  .filters {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 10px;
  }
`;

type JobDescription = {
  jdUid: string;
  jdLink: string;
  jobDetailsFromCompany: string;
  maxJdSalary: number;
  minJdSalary: number;
  salaryCurrencyCode: string;
  location: string;
  minExp: number | null;
  maxExp: number | null;
  jobRole: string;
  companyName: string;
  logoUrl: string;
};

type RequestBody = {
  limit: number;
  offset: number;
};

type FilterObject = {
  minExp: string;
  companyName: string;
  location: string;
  remoteOnsite: string;
  jobRole: string;
  minJdSalary: string;
};

type AppState = {
  jobs: JobDescription[];
  reqBody: RequestBody;
  filters: FilterObject;
};

const getData = async (body: RequestBody): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios.post(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const App = () => {
  const [state, setState] = useState<AppState>({
    jobs: [],
    reqBody: {
      limit: 10,
      offset: 0,
    },
    filters: {
      minExp: "",
      companyName: "",
      location: "",
      remoteOnsite: "",
      jobRole: "",
      minJdSalary: "",
    },
  });

  const onFilterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let newFilters: FilterObject = state.filters;
    switch (e.target.name) {
      case "minExp":
        newFilters.minExp = e.target.value;
        break;
      case "remoteOnsite":
        newFilters.remoteOnsite = e.target.value;
        break;
      case "minJdSalary":
        newFilters.minJdSalary = e.target.value;
        break;
      default:
        break;
    }

    setState((state: AppState) => ({
      ...state,
      filters: newFilters,
    }));
  };

  const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newFilters: FilterObject = state.filters;
    switch (e.target.name) {
      case "companyName":
        newFilters.companyName = e.target.value;
        break;
      case "location":
        newFilters.location = e.target.value;
        break;
      case "jobRole":
        newFilters.jobRole = e.target.value;
        break;
      default:
        break;
    }

    setState((state: AppState) => ({
      ...state,
      filters: newFilters,
    }));
  };

  const applyFilters = (job: JobDescription, filters: FilterObject) => {
    const companyNameFilter: boolean =
      filters.companyName.trim() === "" ||
      job.companyName.toLowerCase().includes(filters.companyName.toLowerCase());

    const minExpFilter: boolean =
      filters.minExp.trim() === "" ||
      (job.minExp !== null && job.minExp >= parseInt(filters.minExp, 10));

    const locationFilter: boolean =
      filters.location.trim() === "" ||
      filters.location.trim().toLowerCase() === "remote" ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const remoteOnsiteFilter: boolean =
      filters.remoteOnsite.trim() === "" ||
      (filters.remoteOnsite.trim().toLowerCase() === "remote" &&
        job.location.toLowerCase() === "remote") ||
      (filters.remoteOnsite.trim().toLowerCase() === "onsite" &&
        job.location.toLowerCase() !== "remote");

    const jobRoleFilter: boolean =
      filters.jobRole.trim() === "" ||
      job.jobRole.toLowerCase().includes(filters.jobRole.toLowerCase());

    const minJdSalaryFilter: boolean =
      filters.minJdSalary.trim() === "" ||
      (job.minJdSalary !== null &&
        job.minJdSalary >= parseInt(filters.minJdSalary, 10));

    return (
      companyNameFilter &&
      minExpFilter &&
      locationFilter &&
      remoteOnsiteFilter &&
      jobRoleFilter &&
      minJdSalaryFilter
    );
  };

  useEffect(() => {
    getData(state.reqBody).then((res: AxiosResponse<any>) => {
      // console.log("useEffect : ", res?.data.jdList);

      if (res && res.data) {
        const newJobs: JobDescription[] = state.jobs.concat(res.data.jdList);
        setState((state: AppState) => ({
          ...state,
          jobs: newJobs,
        }));
      }
    });
  }, [state.reqBody]);

  return (
    <StyledApp>
      <div className="filters">
        <select
          name="minExp"
          value={state.filters.minExp}
          onChange={onFilterSelectChange}
        >
          <option value="" disabled hidden>
            Min Exp
          </option>

          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Company Name"
          value={state.filters.companyName}
          onChange={onFilterTextChange}
          name="companyName"
        />
        <input
          type="text"
          placeholder="Location"
          value={state.filters.location}
          onChange={onFilterTextChange}
          name="location"
        />
        <select
          name="remoteOnsite"
          value={state.filters.remoteOnsite}
          onChange={onFilterSelectChange}
        >
          <option value="" disabled hidden>
            Remote/Onsite
          </option>
          <option value="remote">Remote</option>
          <option value="Onsite">Onsite</option>
        </select>

        <input
          type="text"
          placeholder="Job Role"
          value={state.filters.jobRole}
          onChange={onFilterTextChange}
          name="jobRole"
        />

        <select
          name="minJdSalary"
          value={state.filters.minJdSalary}
          onChange={onFilterSelectChange}
        >
          <option value="" disabled hidden>
            Min Base Pay
          </option>

          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index * 10}>
              {index * 10}L
            </option>
          ))}
        </select>
      </div>
      {/* <span>Hello min Exp : {state.filters.minExp}</span> */}
      <>
        {state.jobs.length > 0 ? (
          <InfiniteScroll
            dataLength={state.jobs.length}
            next={() => {
              setState((state: AppState) => ({
                ...state,
                reqBody: {
                  limit: state.reqBody.limit,
                  offset: state.reqBody.offset + 1,
                },
              }));
            }}
            hasMore={true}
            loader={<></>}
          >
            <div className="grid">
              {state.jobs
                .filter((job) => applyFilters(job, state.filters))
                .map((item: JobDescription, index: number) => (
                  <div className="column" key={index}>
                    <JobCard
                      companyName={item.companyName}
                      jobRole={item.jobRole}
                      location={item.location}
                      maxJdSalary={item.maxJdSalary}
                      minJdSalary={item.minJdSalary}
                      jobDetailsFromCompany={item.jobDetailsFromCompany}
                      minExp={item.minExp}
                      logoUrl={item.logoUrl}
                    />
                  </div>
                ))}
            </div>
          </InfiniteScroll>
        ) : (
          <span>No Data Found</span>
        )}
      </>

      {/* THIS WORKS XD */}
      {/* <button
        onClick={() => {
          setState((state: AppState) => ({
            ...state,
            reqBody: {
              limit: state.reqBody.limit,
              offset: state.reqBody.offset + 1,
            },
          }));
        }}
      >
        Load More
      </button> */}
    </StyledApp>
  );
};

export default App;
