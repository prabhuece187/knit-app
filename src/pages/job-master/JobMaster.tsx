"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DataTableCard from "@/components/custom/DataTableCard";
import { useGetJobsQuery } from "@/api/JobMasterApi";

import {
  getJobMasterColumns,
  searchColumns,
} from "./constant/job-master-config";
import EditJobMaster from "./component/EditJobMaster";
import AddJobMaster from "./component/AddJobMaster";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import {
  jobMasterSchema,
  type Customer,
  type JobMaster,
  type Mill,
} from "@/schema-types/master-schema";
import { useGetMillListQuery } from "@/api/MillApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Inward } from "@/schema-types/inward-schema";
import { useGetInwardListQuery } from "@/api/InwardApi";

export default function JobMaster() {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // const { data, isLoading, isError } = useGetJobsQuery({
  //   limit: 10,
  //   offset: 0,
  //   curpage: 1,
  //   searchInput: "",
  // });

  const limit: number = 10;
  const offset: number = 0;
  const curpage: number = 1;
  const searchInput: string = "";

  const {
    data: response,
    isLoading: isJobLoading,
    isError,
  } = useGetJobsQuery(
    {
      limit,
      offset,
      curpage,
      searchInput,
    },
    {
      skip: limit === 0 && offset === 0 && curpage === 0 && searchInput === "",
    }
  );

  const { data: customers = [] } = useGetCustomerListQuery("") as {
    data: Customer[];
  };

  const { data: mills = [] } = useGetMillListQuery("") as { data: Mill[] };
  const { data: inwards = [] } = useGetInwardListQuery("") as {
    data: Inward[];
  };

  const jobData = response ?? [];

  const form = useForm<JobMaster>({
    resolver: zodResolver(jobMasterSchema),
    defaultValues: {
      // user_id: 1,
      job_date: new Date().toISOString().split("T")[0],
    },
  });

  console.log(form);
  console.log(jobData);

  const columns = getJobMasterColumns(setOpen, setSelectedJobId);

  return (
    <>
      <DataTableCard
        name="Job Master"
        columns={columns}
        data={jobData}
        searchColumns={searchColumns}
        loading={isJobLoading}
        isError={isError}
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            onClick={() => {
              setSelectedJobId(null);
              setOpen(true);
            }}
          >
            Add Job
          </Button>
        }
      />

      {selectedJobId ? (
        <EditJobMaster
          id={selectedJobId}
          open={open}
          setOpen={setOpen}
          customers={customers}
          mills={mills}
          inwards={inwards}
        />
      ) : (
        <AddJobMaster
          open={open}
          setOpen={setOpen}
          customers={customers}
          mills={mills}
          inwards={inwards}
        />
      )}
    </>
  );
}
