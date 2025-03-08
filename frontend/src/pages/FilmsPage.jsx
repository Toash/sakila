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
  Paper,
  TableFooter,
  TablePagination,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { useNavigate, useSearchParams } from "react-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_backend,
});

function FilmsPage() {
  // get query params
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchBy, setSearchBy] = useState("film");

  // get the search and searchBy query params on page load.
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    const initialSearchBy = searchParams.get("searchBy");

    if (initialSearch) {
      setSearch(initialSearch);
      setSubmittedSearch(initialSearch);
      setSearchBy(initialSearchBy || "film");
    }
  }, []);

  useEffect(() => {
    if (submittedSearch) {
      updateQueryParams();
    }
  }, [submittedSearch]);

  const updateQueryParams = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (submittedSearch) {
      if (
        newSearchParams.get("search") === submittedSearch &&
        newSearchParams.get("searchBy") === searchBy
      ) {
        return;
      }
      newSearchParams.set("search", submittedSearch);
      newSearchParams.set("searchBy", searchBy);
    } else {
      newSearchParams.delete("search");
      newSearchParams.delete("searchBy");
    }
    navigate(`?${newSearchParams.toString()}`);
  };

  async function fetchFilms() {
    if (!submittedSearch) {
      const response = await api.get('/films');
      return response.data;
    }

    let endpoint = "";
    if (searchBy === "film") {
      endpoint = `/films/search/title/${submittedSearch}`;
    } else if (searchBy === "actor") {
      endpoint = `/films/search/actor/${submittedSearch}`;
    } else if (searchBy === "genre") {
      endpoint = `/films/search/genre/${submittedSearch}`;
    } else {
      console.error("Wrong search by");
      return [];
    }

    const response = await api.get(endpoint);
    return response.data;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["films", submittedSearch, searchBy],
    queryFn: fetchFilms,
  });

  function Row({ film, searchBy }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <>
        <TableRow 
          onClick={() => setOpen(!open)}
          sx={{ 
            '& > *': { borderBottom: 'unset' },
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)', 
              transform: 'scale(1.005)', 
            },
            transition: 'all 0.2s ease',
            backgroundColor: open ? 'rgba(25, 118, 210, 0.12)' : 'inherit',
          }}
        >
          <TableCell>{film.title}</TableCell>
          {searchBy === "actor" && <TableCell>{film.actor_name}</TableCell>}
          <TableCell>{film.genre}</TableCell>
          <TableCell>{film.release_year}</TableCell>
          <TableCell>{film.length}</TableCell>
          <TableCell>{film.rating}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={searchBy === "actor" ? 7 : 6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Film Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    {film.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rental Rate: ${film.rental_rate} | Rental Duration: {film.rental_duration} days
                  </Typography>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/film/title/" + encodeURIComponent(film.title));
                    }}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    See Full Details
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function FilmTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Box width="90%">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                {searchBy === "actor" && <TableCell>Actor</TableCell>}
                <TableCell>Genre</TableCell>
                <TableCell>Release Year</TableCell>
                <TableCell>Length (Minutes)</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data
              )?.map((film, i) => (
                <Row key={i} film={film} searchBy={searchBy} />
              ))}
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
      FILMS PAGE
      </Typography>

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

      <FilmTable></FilmTable>
    </Box>
  );
}

export default FilmsPage;
