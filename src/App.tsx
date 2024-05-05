import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

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

type AppState = {
  jobs: JobDescription[];
  reqBody: RequestBody;
};

const getData = async (body: RequestBody) => {
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
  }
};

const App = () => {
  const [state, setState] = useState<AppState>({
    jobs: [],
    reqBody: {
      limit: 10,
      offset: 0,
    },
  });

  useEffect(() => {
    getData(state.reqBody).then((res) => {
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
    <div className="App">
      <>
        {state.jobs.length > 0 ? (
          <div>
            {state.jobs.map((item: JobDescription, index: number) => (
              <li key={index}>{item.companyName}</li>
            ))}
          </div>
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
    </div>
  );
};

export default App;
