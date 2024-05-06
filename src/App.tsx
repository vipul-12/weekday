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
    },
  });

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newFilters: FilterObject = state.filters;
    switch (e.target.name) {
      case "companyName":
        newFilters.companyName = e.target.value;
        break;
      default:
        break;
    }

    setState((state: AppState) => ({
      ...state,
      filters: newFilters,
    }));
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
        <input
          type="text"
          placeholder="Company Name"
          value={state.filters.companyName}
          onChange={onFilterChange}
          name="companyName"
        />
      </div>
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
            loader={<h4>Loading...</h4>}
          >
            <div className="grid">
              {state.jobs
                .filter((job) => {
                  return state.filters.companyName.toLowerCase() === ""
                    ? job
                    : job.companyName
                        .toLowerCase()
                        .includes(state.filters.companyName.toLowerCase());
                })
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
          <span>Loading ...</span>
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
