import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { useNavigate, useSearchParams } from "react-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_backend,
});

function CustomersPage() {
  // get query params
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  // get the search and searchBy query params on page load.
  // update states from these query params
  // these states that are updated will trigger useQuery to fetch the data.
  useEffect(() => {
    const initialSearch = searchParams.get("search");

    if (!initialSearch) return;

    setSearch(initialSearch);
    setSubmittedSearch(initialSearch);
  }, []);

  // useeffect will run when variables in dependency array changes.
  // state changes are asyncronous so we need to do this
  // (setSubmittedSearch will not update submittedSearch immediately)
  useEffect(() => {
    if (submittedSearch) updateQueryParams();
  }, [submittedSearch]);

  const updateQueryParams = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString()); // Create a copy
    if (newSearchParams.get("search") === submittedSearch) {
      return;
    }
    newSearchParams.set("search", submittedSearch);
    navigate(`?${newSearchParams.toString()}`); // Update URL
  };

  async function searchCustomers() {
    let endpoint = "";

    if (!submittedSearch) {
      console.log("setting endpoint ");
      endpoint = `/customers`;
    }

    const response = await api.get(endpoint);
    return response.data;
  }

  const { data, isLoading } = useQuery({
    // will refetch data when query key changes
    queryKey: ["customerSearch", submittedSearch],
    queryFn: searchCustomers,
  });

  function CustomerTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    if (isLoading) {
      return <CircularProgress></CircularProgress>;
    }

    return (
      <Box width="90%">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              )?.map((e, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{e.first_name}</TableCell>
                    <TableCell>{e.last_name}</TableCell>
                    <TableCell>{e.email}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {data && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    count={data?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  ></TablePagination>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box
      mt="6rem"
      display="flex"
      flexDirection="column"
      gap="4rem"
      alignItems={"center"}
    >
      <Typography textAlign="center" fontWeight="bold" variant="h1">
        Customers page
      </Typography>

      {/*
      <Box width="100%" id="search" display="flex" justifyContent={"center"}>
        <Box width="80%" display="flex">
          <TextField
            label="Search"
            sx={{ flex: "1" }}
            value={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSubmittedSearch(search);
              }
            }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></TextField>

          <FormControl sx={{ minWidth: "300px" }}>
            <InputLabel labelId="option-label">Search By</InputLabel>
            <Select
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              label="option"
              labelId="option-label"
            >
              <MenuItem value="film">Film</MenuItem>
              <MenuItem value="actor">Actor</MenuItem>
              <MenuItem value="genre">Genre</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSubmittedSearch(search);
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
      */}

      <CustomerTable></CustomerTable>
    </Box>
  );
}

export default CustomersPage;
