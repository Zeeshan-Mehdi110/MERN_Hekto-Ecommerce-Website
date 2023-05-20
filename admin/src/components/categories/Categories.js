import React, { useMemo, useState } from 'react';
import { Grid, Box, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, IconButton, Paper, Pagination, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import TableContainer from '@mui/material/TableContainer';
import DeletePopUp from '../common/DeletePopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { categoryActionTypes, loadCategories } from '../../store/actions/categoryActions';
import { Link, useParams } from 'react-router-dom';

const columns = [
  { id: 'categoryName', label: 'Name', },
  { id: 'categoryDescription', label: 'Description' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    flex: 1
  },
  table: {
    height: "100%",
    width: "100%"
  },
  list: {},
  thead: {},
  tbody: {
    width: "100%"
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    boxSizing: "border-box",
    minWidth: "100%",
    width: "100%"
  },
  headerRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  cell: {
    display: "inline-flex",
    alignItems: "center",
    overflow: "hidden",
    flexGrow: 0,
    flexShrink: 0
  },
  justifyCenter: {
    justifyContent: "center"
  },
  expandingCell: {
    flex: 1
  },
  column: {},
  tableContainer: {
    "maxWidth": "100vw",
    overFlow: "scroll",
    WebkitOverflowScrolling: 'touch',
    '-ms-overflow-style': '-ms-autohiding-scrollbar'
  }
}));


function Categories({ categories, totalRecords, paginationArray, dispatch }) {
  const { recordsPerPage, pageNumber } = useParams(); // while coming back from Edit item

  const [rowsPerPage, setRowsPerPage] = useState(parseInt(process.env.REACT_APP_RECORDS_PER_PAGE));
  const [page, setPage] = useState(0);
  const [rowsPerPageChanged, setRowsPerPageChanged] = useState(false);
  const classes = useStyles();

  const totalPages = useMemo(() => Math.ceil(totalRecords / rowsPerPage), [categories, rowsPerPage]);

  useEffect(() => {
    dispatch(loadCategories(page, rowsPerPage))
  }, [page, rowsPerPage])


  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
    // listRef.current && listRef.current.scrollToItem(0);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
    dispatch({ type: categoryActionTypes.RESET_CATEGORY })
    dispatch({ type: categoryActionTypes.UPDATE_ROWS_PREPARE, payload: event.target.value })
  };


  const visibleRows = React.useMemo(() => {
    if (paginationArray[page]) {
      return categories.slice(paginationArray[page].startIndex, paginationArray[page].endIndex);
    }
    else {
      return [];
    }
  }, [categories, page, rowsPerPage])

  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {
                  columns.map((column, index) => (
                    <TableCell key={index}>{column.label}</TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => {
                const descriptionWords = row.description ? row.description.split(' ') : [];
                const slicedDescription = descriptionWords.slice(0, 6).join(' ');
                const displayDescription = descriptionWords.length > 1 ? `${slicedDescription}...` : slicedDescription;

                return (
                  <TableRow key={row._id} className={classes.headerRow}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description ? displayDescription : ''}</TableCell>
                    <TableCell sx={{ display: "flex" }}>
                      <Link to={"/admin/category/edit/" + row._id + "/" + rowsPerPage + "/" + page}>
                        <IconButton sx={{ color: "blue" }}>
                          <FontAwesomeIcon icon={faEdit} style={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Link>
                      <DeletePopUp id={row._id} page={page} actionType={"category"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100, 250, 500]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              // page={users.length ? page - 1 : 0}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              backIconButtonProps={{
                style: { display: "none" }
              }}
              nextIconButtonProps={{
                style: { display: "none" }
              }}

              style={{ height: "45px", overflow: "hidden" }}
            />
            <Box>
              <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} variant="outlined" color="primary" shape="rounded" />
            </Box>
          </Box>
        </TableContainer>
      </Grid>
    </Grid>

  )
}


const mapStateToProps = state => {
  return {
    categories: state.categories.categories,
    totalRecords: state.categories.totalRecords,
    loadingRecords: state.progressBar.loading,
    paginationArray: state.categories.paginationArray
  }
}

export default connect(mapStateToProps)(Categories);