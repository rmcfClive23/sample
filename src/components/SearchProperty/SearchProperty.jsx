import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { SearchOutlined } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./style.scss";

const BtnDropDown = ({
  value,
  anchorEl,
  open,
  handleShowPopper,
  handleClickFilter,
}) => {
  return (
    <div className="btn-dropdown">
      <Button
        className="btn-main"
        onClick={(event) => handleShowPopper(event, "button")}
      >
        {value}
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom" transition>
        <Paper className="margin-10">
          <List component="nav" aria-label="secondary mailbox folders">
            {["Address", "City", "State"]
              .filter((val) => val.toUpperCase() !== value.toUpperCase())
              .map((elm) => (
                <ListItem button onClick={() => handleClickFilter(elm)}>
                  <ListItemText primary={elm} />
                </ListItem>
              ))}
          </List>
        </Paper>
      </Popper>
    </div>
  );
};

const InputField = ({
  anchorEl,
  open,
  handleShowPopper,
  handleClickAway,
  value,
  handleSelect,
  options,
}) => {
  return (
    <>
      <input
        className="form-control"
        placeholder="Search by Address, City or State"
        onChange={(event) => handleShowPopper(event, "input")}
        value={value}
      />

      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper open={open} anchorEl={anchorEl} placement="bottom" transition>
          <Paper className="margin-10">
            <List component="nav" aria-label="secondary mailbox folders">
              {options
                .filter((val) => val.includes(value))
                .map((elm) => (
                  <ListItem button onClick={() => handleSelect(elm)}>
                    <ListItemText primary={elm} />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Popper>
      </ClickAwayListener>
    </>
  );
};

const SearchProperty = () => {
  const inputRef = useRef(null);
  const [anchorInputEl, setInputAnchorEl] = useState(null);
  const [anchorBtnEl, setBtnAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchParam, setSearchParam] = useState("address");
  const [list, setList] = useState([]);

  useEffect(() => {
    if (searchParam && searchValue) {
      const payload = {
        method: "GET",
        params: {
          address: searchParam.toUpperCase() === "ADDRESS" ? searchValue : "",
          city: searchParam.toUpperCase() === "CITY" ? searchValue : "",
          state: searchParam.toUpperCase() === "STATE" ? searchValue : "",
        },
      };
      axios
        .get("http://localhost:9091", payload)
        .then((res) => {
          if (res) {
            setList([
              ...[res].map(
                ({ address, city, state }) => `${address}, ${city}, ${state}`
              ),
            ]);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [searchParam, searchValue]);

  const handleShowPopper = (event, param) => {
    if (param.toUpperCase() === "INPUT") {
      setInputAnchorEl(
        event.target.value.length === 0 ? null : event.currentTarget
      );
      setSearchValue(event.target.value);
    } else {
      setBtnAnchorEl(event.currentTarget);
    }
  };

  const handleClickAway = () => {
    setInputAnchorEl(null);
  };

  const handleClickFilter = (value) => {
    setSearchParam(value);
    setBtnAnchorEl(null);
    setSearchValue("");
  };

  const handleSelect = (value) => {
    console.log("Seleted", value);
  };

  return (
    <div className="search-container">
      <Box width="100%">
        <Typography variant="h6" className="title">
          Search Property, Evaluate Risk
        </Typography>
        <Typography variant="h1" className="main-title">
          Quick way to Find the Risk of your Property
        </Typography>
        <Box display="flex" width="100%" justifyContent="center">
          <div className="input-container">
            <Container>
              <form className="position-relative">
                <div className="input-group">
                  <BtnDropDown
                    value={searchParam}
                    anchorEl={anchorBtnEl}
                    open={Boolean(anchorBtnEl)}
                    handleShowPopper={handleShowPopper}
                    handleClickFilter={handleClickFilter}
                  />
                  <InputField
                    inputRef={inputRef}
                    anchorEl={anchorInputEl}
                    open={Boolean(anchorInputEl)}
                    handleShowPopper={handleShowPopper}
                    handleClickAway={handleClickAway}
                    handleSelect={handleSelect}
                    options={list}
                    value={searchValue}
                  />
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </div>
              </form>
            </Container>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default SearchProperty;
