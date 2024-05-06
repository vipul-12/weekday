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
    align-items: center;
  }

  .column {
    flex: 0 0 100%;
    padding: 1rem;
    box-sizing: border-box;
    max-width: 100%;

    @media (min-width: 768px) {
      flex: 0 0 50%;
      max-width: 50%;
    }

    @media (min-width: 1169px) {
      flex: 0 0 33.33%;
      max-width: 33.33%;
    }
  }

  .filters {
    // margin: 10px;
    display: flex;
    justify-content: center;
    top: 0;
    z-index: 10;
    padding: 10px;
    // box-sizing: border-box;
  }

  .text-input {
    border: 1px solid #cccccc;
    border-radius: 4px;
    height: 40px;
    padding: 8px 12px;
    margin: 0px 3px;
    box-sizing: border-box;
    font-size: 16px;
  }

  .select-input {
    border: 1px solid #cccccc;
    border-radius: 4px;
    height: 40px;
    padding: 8px 12px;
    margin: 0px 3px;
    box-sizing: border-box;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .filters {
      flex-wrap: wrap;
      top: 0;
      z-index: 10;
    }

    .text-input,
    .select-input,
    .clear-select {
      flex: 0 0 100%;
      max-width: 30%;
    }
    .clear-select {
      cursor: pointer;
    }
  }

  .clear-select {
    padding: 3px;
    cursor: pointer;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2d374880;
    z-index: 100;
  }

  .modalContent {
    position: relative;
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 75%;
    height: 67%;
  }

  .cross {
    position: absolute;
    right: 10px;
    top: 0;
    cursor: pointer;
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
  isModalOpen: boolean;
  enlargedJobDetails: string;
  enlargedName: string;
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
    isModalOpen: false,
    enlargedJobDetails: "",
    enlargedName: "",
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

  const openModal = (details: string, companyName: string) => {
    setState((state: AppState) => ({
      ...state,
      isModalOpen: true,
      enlargedJobDetails: details,
      enlargedName: companyName,
    }));
  };

  const closeModal = () => {
    setState((state: AppState) => ({
      ...state,
      isModalOpen: false,
      enlargedJobDetails: "",
      enlargedName: "",
    }));
  };

  useEffect(() => {
    getData(state.reqBody).then((res: AxiosResponse<any>) => {
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
          className="select-input"
        >
          <option value="" disabled hidden>
            Min Exp
          </option>

          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} year(s)
            </option>
          ))}
        </select>
        {state.filters.minExp !== "" && (
          <div
            className="clear-select"
            onClick={() => {
              setState((state: AppState) => ({
                ...state,
                filters: {
                  ...state.filters,
                  minExp: "",
                },
              }));
            }}
          >
            x
          </div>
        )}
        <input
          type="text"
          placeholder="Company Name"
          value={state.filters.companyName}
          onChange={onFilterTextChange}
          name="companyName"
          className="text-input"
        />
        <input
          type="text"
          placeholder="Location"
          value={state.filters.location}
          onChange={onFilterTextChange}
          name="location"
          className="text-input"
        />
        <select
          name="remoteOnsite"
          value={state.filters.remoteOnsite}
          onChange={onFilterSelectChange}
          className="select-input"
        >
          <option value="" disabled hidden>
            Remote/Onsite
          </option>
          <option value="remote">Remote</option>
          <option value="Onsite">Onsite</option>
        </select>
        {state.filters.remoteOnsite !== "" && (
          <div
            className="clear-select"
            onClick={() => {
              setState((state: AppState) => ({
                ...state,
                filters: {
                  ...state.filters,
                  remoteOnsite: "",
                },
              }));
            }}
          >
            x
          </div>
        )}

        <input
          type="text"
          placeholder="Job Role"
          value={state.filters.jobRole}
          onChange={onFilterTextChange}
          name="jobRole"
          className="text-input"
        />

        <select
          name="minJdSalary"
          value={state.filters.minJdSalary}
          onChange={onFilterSelectChange}
          className="select-input"
        >
          <option value="" disabled hidden>
            Min Base Pay
          </option>

          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index * 10}>
              {index * 10}K
            </option>
          ))}
        </select>
        {state.filters.minJdSalary !== "" && (
          <div
            className="clear-select"
            onClick={() => {
              setState((state: AppState) => ({
                ...state,
                filters: {
                  ...state.filters,
                  minJdSalary: "",
                },
              }));
            }}
          >
            x
          </div>
        )}
      </div>
      <>
        {state.jobs.filter((job: JobDescription) =>
          applyFilters(job, state.filters)
        ).length > 0 ? (
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
                .filter((job: JobDescription) =>
                  applyFilters(job, state.filters)
                )
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
                      openModal={openModal}
                    />
                  </div>
                ))}
            </div>
          </InfiniteScroll>
        ) : (
          <span>No Data Found</span>
        )}
      </>

      {state.isModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <div onClick={closeModal} className="cross">
              {" "}
              X
            </div>
            <div>
              <h3>About {state.enlargedName}</h3>
              <p>{state.enlargedJobDetails}</p>
            </div>
          </div>
        </div>
      )}
    </StyledApp>
  );
};

export default App;
