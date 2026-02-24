"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import EnhancedDataTableCard from "@/components/custom/EnhancedDataTableCard";
import { getJobMasterColumns } from "./constant/job-master-config";
import {
  type Customer,
  type JobMasterQuery,
  type JobMasterWithRelations,
  type Mill,
} from "@/schema-types/master-schema";
import { useDataTable } from "@/hooks/useDataTable";
import { useGetJobsQuery } from "@/api/JobMasterApi";

import EditJobMaster from "./component/EditJobMaster";
import AddJobMaster from "./component/AddJobMaster";
import { useGetCustomerListQuery } from "@/api/CustomerApi";
import { useGetMillListQuery } from "@/api/MillApi";
import { useGetInwardListQuery } from "@/api/InwardApi";
import type { Inward } from "@/schema-types/inward-schema";

export default function JobMaster() {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const {
    pagination,
    searchTerm,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSearchChange,
    queryParams,
  } = useDataTable<JobMasterQuery, JobMasterWithRelations>({
    searchField: "search",
    initialLimit: 10,
    initialPage: 1,
  });

         const { data: customers = [] } = useGetCustomerListQuery("") as {
           data: Customer[];
         };

         const { data: mills = [] } = useGetMillListQuery("") as {
           data: Mill[];
         };
         const { data: inwards = [] } = useGetInwardListQuery("") as {
           data: Inward[];
         };

  const { data, isLoading, isError } = useGetJobsQuery(
    { ...queryParams },
    { refetchOnMountOrArgChange: true },
  );

  const columns = useMemo(
    () => getJobMasterColumns(setOpen, setSelectedJobId),
    [],
  );

  return (
    <>
      <EnhancedDataTableCard
        name="Job Master"
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta ?? pagination}
        loading={isLoading}
        isError={isError}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        searchPlaceholder="Search job / inward / customer / mill..."
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
      )
      }
    </>
  );
}
