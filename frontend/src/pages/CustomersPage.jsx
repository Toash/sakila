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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import { Edit, Delete, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useEffect, useState } from "react";

import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useNavigate, useSearchParams } from "react-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_backend,
});

function CustomersPage() {
  const queryClient = useQueryClient();
  // get query params
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  //data typed in search bar
  const [search, setSearch] = useState("");
  // entered search term
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [searchBy, setSearchBy] = useState("first");

  // order by id
  const [orderBy, setOrderBy] = useState('customer_id');
  const [order, setOrder] = useState('asc');

  // add customer modal
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // edit customer modal
  const [editOpen, setEditOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    customer_id: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [editFormErrors, setEditFormErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClickOpen = (customer) => {
    setEditCustomer({
      customer_id: customer.customer_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditFormErrors({
      first_name: "",
      last_name: "",
      email: "",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateForm = () => {
    const errors = {
      first_name: "",
      last_name: "",
      email: "",
    };
    let isValid = true;

    if (!newCustomer.first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    } else if (newCustomer.first_name.length > 45) {
      errors.first_name = "First name must be less than 45 characters";
      isValid = false;
    }

    if (!newCustomer.last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    } else if (newCustomer.last_name.length > 45) {
      errors.last_name = "Last name must be less than 45 characters";
      isValid = false;
    }

    if (!newCustomer.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(newCustomer.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    } else if (newCustomer.email.length > 50) {
      errors.email = "Email must be less than 50 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddCustomer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await api.post("/customers", newCustomer);
      setOpen(false);
      setSnackbarMessage(
        `Successfully added ${newCustomer.first_name} ${newCustomer.last_name}`
      );
      setSnackbarOpen(true);
      setSubmittedSearch("");
      setNewCustomer({
        first_name: "",
        last_name: "",
        email: "",
      });
      setFormErrors({
        first_name: "",
        last_name: "",
        email: "",
      });
      queryClient.invalidateQueries({ queryKey: ["customerSearch"] });
    } catch (error) {
      console.error("Failed to add customer", error);
      setSnackbarMessage("Failed to add customer");
      setSnackbarOpen(true);
    }
  };

  const validateEditForm = () => {
    const errors = {
      first_name: "",
      last_name: "",
      email: "",
    };
    let isValid = true;

    if (!editCustomer.first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    } else if (editCustomer.first_name.length > 45) {
      errors.first_name = "First name must be less than 45 characters";
      isValid = false;
    }

    if (!editCustomer.last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    } else if (editCustomer.last_name.length > 45) {
      errors.last_name = "Last name must be less than 45 characters";
      isValid = false;
    }

    if (!editCustomer.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(editCustomer.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    } else if (editCustomer.email.length > 50) {
      errors.email = "Email must be less than 50 characters";
      isValid = false;
    }

    setEditFormErrors(errors);
    return isValid;
  };

  const handleEditCustomer = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      await api.put(`/customers/${editCustomer.customer_id}`, {
        first_name: editCustomer.first_name,
        last_name: editCustomer.last_name,
        email: editCustomer.email,
      });
      setEditOpen(false);
      setSnackbarMessage(
        `Successfully edited ${editCustomer.first_name} ${editCustomer.last_name}`
      );
      setSnackbarOpen(true);
      setEditFormErrors({
        first_name: "",
        last_name: "",
        email: "",
      });
      queryClient.invalidateQueries({ queryKey: ["customerSearch"] });
    } catch (error) {
      console.error("Failed to edit customer", error);
      setSnackbarMessage("Failed to edit customer");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      setSnackbarMessage(`Successfully deleted customer`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
    queryClient.invalidateQueries({ queryKey: ["customerSearch"] });
  };

  // get the search and searchBy query params on page load.
  // update states from these query params
  // these states that are updated will trigger useQuery to fetch the data.
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    const initialSearchBy = searchParams.get("searchBy") || "first";

    setSearch(initialSearch || "");
    setSubmittedSearch(initialSearch || "");
    setSearchBy(initialSearchBy);
  }, []);

  useEffect(() => {
    updateQueryParams();
  }, [submittedSearch, searchBy]);

  const updateQueryParams = () => {
    const newSearchParams = new URLSearchParams();
    
    if (submittedSearch) {
      newSearchParams.set("search", submittedSearch);
      newSearchParams.set("searchBy", searchBy);
    }
    
    const currentParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.toString() === currentParams.toString()) {
      return;
    }
    
    navigate(`?${newSearchParams.toString()}`);
  };

  async function searchCustomers() {
    let endpoint = "";

    if (!submittedSearch) {
      endpoint = `/customers`;
    } else if (searchBy === "id") {
      endpoint = `/customers/id/${submittedSearch}`;
    } else if (searchBy === "first") {
      endpoint = `/customers/first/${submittedSearch}`;
    } else if (searchBy === "last") {
      endpoint = `/customers/last/${submittedSearch}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  }

  const { data, isLoading} = useQuery({
    // will refetch data when query key changes
    queryKey: ["customerSearch", submittedSearch, searchBy],
    queryFn: searchCustomers,
  });

  function Row({ customer, handleEditClickOpen, handleDeleteCustomer }) {
    const [open, setOpen] = useState(false);

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
          <TableCell>{customer.customer_id}</TableCell>
          <TableCell>{customer.first_name}</TableCell>
          <TableCell>{customer.last_name}</TableCell>
          <TableCell>{customer.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, display: 'flex', gap: 2 }}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row toggle
                    handleEditClickOpen(customer);
                  }}
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Edit Customer
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row toggle
                    handleDeleteCustomer(customer.customer_id);
                  }}
                  color="secondary"
                  variant="outlined"
                  size="small"
                >
                  Delete Customer
                </Button>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function CustomerTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleRequestSort = (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const sortData = (data) => {
      if (!data) return [];
      return [...data].sort((a, b) => {
        if (orderBy === 'customer_id') {
          return order === 'asc' 
            ? a.customer_id - b.customer_id
            : b.customer_id - a.customer_id;
        }
        return 0;
      });
    };

    if (isLoading) {
      return <CircularProgress></CircularProgress>;
    }

    const sortedData = sortData(data);

    return (
      <Box width="90%">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleRequestSort('customer_id')}
                  >
                    ID
                    {orderBy === 'customer_id' && (
                      <Typography component="span" sx={{ ml: 1 }}>
                        {order === 'asc' ? '↑' : '↓'}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>First</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sortedData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : sortedData
              )?.map((customer) => (
                <Row
                  key={customer.customer_id}
                  customer={customer}
                  handleEditClickOpen={handleEditClickOpen}
                  handleDeleteCustomer={handleDeleteCustomer}
                />
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
      CUSTOMERS PAGE
      </Typography>

      {/* SEARCH */}
      <Box width="100%" id="search" display="flex" justifyContent={"center"}>
        <Box width="80%" display="flex" flexWrap={"wrap"} gap=".5rem">
          <TextField
            label="Search"
            sx={{ flex: "4 0 300px" }}
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
          <FormControl sx={{ flex: "1 0 200px" }}>
            <InputLabel labelId="option-label">Search By</InputLabel>
            <Select
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              label="option"
              labelId="option-label"
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="first">First Name</MenuItem>
              <MenuItem value="last">Last Name</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              setSubmittedSearch(search);
            }}
            sx={{ flex: "1" }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ flex: "1" }}
          >
            Add
          </Button>
        </Box>
      </Box>
      <CustomerTable></CustomerTable>

      {/* Add Customer Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Customer</DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddCustomer();
        }}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              required
              fullWidth
              value={newCustomer.first_name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, first_name: e.target.value })
              }
              error={!!formErrors.first_name}
              helperText={formErrors.first_name}
            />
            <TextField
              margin="dense"
              label="Last Name"
              required
              fullWidth
              value={newCustomer.last_name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, last_name: e.target.value })
              }
              error={!!formErrors.last_name}
              helperText={formErrors.last_name}
            />
            <TextField
              margin="dense"
              label="Email"
              required
              fullWidth
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              handleClose();
              setFormErrors({
                first_name: "",
                last_name: "",
                email: "",
              });
            }}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEditCustomer();
        }}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              required
              fullWidth
              value={editCustomer.first_name}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, first_name: e.target.value })
              }
              error={!!editFormErrors.first_name}
              helperText={editFormErrors.first_name}
            />
            <TextField
              margin="dense"
              label="Last Name"
              required
              fullWidth
              value={editCustomer.last_name}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, last_name: e.target.value })
              }
              error={!!editFormErrors.last_name}
              helperText={editFormErrors.last_name}
            />
            <TextField
              margin="dense"
              label="Email"
              required
              fullWidth
              type="email"
              value={editCustomer.email}
              onChange={(e) =>
                setEditCustomer({ ...editCustomer, email: e.target.value })
              }
              error={!!editFormErrors.email}
              helperText={editFormErrors.email}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomersPage;
