import Admin from "@/layout/Admin";
import Page from "@/layout/Page";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled, useTheme } from "@mui/material/styles";
import { Formik, Form, Field } from "formik";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  useGetAllQuery,
  useCreateMutation,
  useUpdateByIdMutation,
  useRemoveManyMutation,
  useUndoMutation,
} from "@/store/members";
import { useGetAllQuery as useGetAllQueryRoles } from "@/store/roles";

import { useForceUpdate } from "@/lib/helper-ui";

// const roles = ["Admin", "Common"];

export default function Members(props) {
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const theme = useTheme();
  const {
    data: members = [{}, {}, {}],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllQuery();
  const { data: roles = [] } = useGetAllQueryRoles();
  const [
    create,
    {
      error: errorCreating,
      isLoading: isCreating,
      isSuccess: isCreatingSuccess,
      isError: isCreatingError,
    },
  ] = useCreateMutation();
  const [
    update,
    {
      isLoading: isUpdating,
      isSuccess: isUpdatingSuccess,
      isError: isUpdatingError,
    },
  ] = useUpdateByIdMutation();
  const [
    removeAll,
    {
      data: dataRemoving = [],
      error: errorRemoving,
      isLoading: isRemoving,
      isSuccess: isRemovingSuccess,
      isError: isRemovingError,
    },
  ] = useRemoveManyMutation();
  const [
    undo,
    {
      error: errorUndoing,
      isLoading: isUndoing,
      isSuccess: isUndoingSuccess,
      isError: isUndoingError,
    },
  ] = useUndoMutation();
  // const [showLoader, setShowLoader] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [removeList, setRemoveList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [buttonToggleGroup, setButtonToggleGroup] = useState([]);
  const [dialogValue, setDialogValue] = useState({
    id: undefined,
    image: "",
    name: "",
    email: "",
    role: "",
    password: "",
    showPassword: false,
  });
  const [snack, setSnack] = useState({
    id: 1111,
    open: false,
    timeout: 6000,
    message: <div></div>,
    vertical: "bottom",
    horizontal: "center",
  });
  const handleCreateOrUpdateMember = async (values, { setSubmitting }) => {
    // console.log(values, dialogValue);
    delete values.id;
    delete values.showPassword;
    if (dialogValue.id) {
      update({ id: dialogValue.id, data: values });
    } else {
      create({ data: values });
    }
    setSubmitting(false);
    handleDialogAddClose();
  };
  const handleEnableRemoveMode = () => {
    setRemoveMode(true);
    setRemoveList([]);
  };
  const handleDisableRemoveMode = () => {
    setRemoveMode(false);
    setRemoveList([]);
    setButtonToggleGroup([]);
  };
  const handleRemoveSelection = (index) => (event) => {
    if (removeList.includes(index)) {
      removeList.splice(index, 1);
    } else {
      removeList.push(index);
    }
    setRemoveList(Array.of(...removeList));
  };
  const handleRemoveDone = () => {
    handleOpenDialog();
    // handleDisableRemoveMode();
  };
  const handleRemoveCancel = () => {
    handleDisableRemoveMode();
  };
  const handleRemoveDialogconfirm = () => {};
  const handleRemoveMember = () => {
    handleCloseDialog();
    handleDisableRemoveMode();
    const ids = [];
    for (const index of removeList) {
      const member = members[index];
      ids.push(member.id);
    }
    removeAll({ ids });
  };
  const handleRemoveUndo = () => {
    undo({ list: dataRemoving });
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialogAdd = () => {
    setOpenDialogAdd(true);
  };
  const handleCloseDialogAdd = () => {
    setOpenDialogAdd(false);
  };
  const handleDialogAddClose = () => {
    handleCloseDialogAdd();
    setButtonToggleGroup([]);
    setDialogValue({
      id: undefined,
      image: "",
      name: "",
      email: "",
      role: "",
      password: "",
      showPassword: false,
    });
  };
  const handleOpenSnack = (message) => {
    setSnack({ open: true, message, vertical: "bottom", horizontal: "center" });
  };
  const handleCloseSnack = () => {
    setSnack({
      open: false,
      message: <div></div>,
      vertical: "bottom",
      horizontal: "center",
    });
  };
  const handleCardClick = (index) => (event) => {
    if (removeMode) {
      handleRemoveSelection(index)();
    } else {
      const member = members[index];
      if (member) {
        const copy = { ...member, showPassword: false };
        delete copy.password;
        setDialogValue(copy);
        handleOpenDialogAdd();
      }
    }
  };

  const handleButtonToggleGroup = (event, formats) => {
    setButtonToggleGroup(([prev]) => {
      const value = formats.pop();
      if (value == "Remove") {
        handleEnableRemoveMode();
      } else if (value == "Add") {
        handleOpenDialogAdd();
      }
      if (prev) {
        return [prev];
      } else {
        return [value];
      }
    });
  };

  useEffect(() => {
    forceUpdate();
  }, [isFetching, isCreating, isUpdating, isRemoving, isUndoing]);

  useEffect(() => {
    if (isCreatingSuccess) {
      refetch();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Create Member.
          </Alert>
        ),
      }));
    } else if (isCreatingError) {
      const message = errorCreating.error
        ? errorCreating.error
        : errorCreating.data.message;
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      }));
    }
  }, [isCreatingSuccess, isCreatingError]);

  useEffect(() => {
    if (isUpdatingSuccess) {
      refetch();
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Update Member.
          </Alert>
        ),
      }));
    } else if (isUpdatingError) {
      const message = errorUpdating.error
        ? errorUpdating.error
        : errorUpdating.data.message;
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      }));
    }
  }, [isUpdatingSuccess, isUpdatingError]);

  useEffect(() => {
    if (isRemovingSuccess) {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert
            elevation={6}
            severity="success"
            action={
              <Button color="info" size="small" onClick={handleRemoveUndo}>
                Undo
              </Button>
            }
          >
            Success Remove {dataRemoving.length} Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isRemovingError) {
      const message = errorRemoving.error
        ? errorRemoving.error
        : errorRemoving.data.message;

      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      }));
    }
  }, [isRemovingSuccess, isRemovingError]);

  useEffect(() => {
    if (isUndoingSuccess) {
      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="success">
            Success Undo {dataRemoving.length} Member.
          </Alert>
        ),
      }));
      refetch();
    } else if (isUndoingError) {
      const message = errorUndoing.error
        ? errorUndoing.error
        : errorUndoing.data.message;

      setSnack((prev) => ({
        ...prev,
        open: true,
        message: (
          <Alert elevation={6} severity="error">
            {message}
          </Alert>
        ),
      }));
    }
  }, [isUndoingSuccess, isUndoingError]);

  return (
    <Page>
      <Admin
        pageTitle="Members"
        loaderProgress={{
          // show: showLoader,
          show:
            isFetching || isCreating || isUpdating || isRemoving || isUndoing,
        }}
      >
        <Box
          display="grid"
          padding={{
            mobile: "16px",
            tablet: "32px",
          }}
          gap={{
            mobile: "16px",
            tablet: "32px",
          }}
        >
          <Box
            display="flex"
            gap={{
              mobile: "16px",
              tablet: "32px",
            }}
          >
            <Paper elevation={0}>
              <ToggleButtonGroup
                value={buttonToggleGroup}
                onChange={handleButtonToggleGroup}
                aria-label="Operation Controll"
              >
                <ToggleButton value="Add" aria-label="Add Member">
                  <Tooltip title="Add Member">
                    <AddIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="Remove" aria-label="Remove Member">
                  <Tooltip title="Remove Member">
                    <RemoveIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="Search" aria-label="Search">
                  <Tooltip title="Search">
                    <SearchIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="more" aria-label="More Options">
                  <Tooltip title="More Options">
                    <MoreVertIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
            {removeMode && (
              <Paper elevation={0}>
                <ToggleButtonGroup aria-label="Remove Operation Confirm">
                  <ToggleButton
                    value="Done"
                    aria-label="Done Remove"
                    onClick={handleRemoveDone}
                  >
                    <Tooltip title="Done Remove">
                      <DoneIcon />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton
                    value="Clear"
                    aria-label="Clear Remove"
                    onClick={handleRemoveCancel}
                  >
                    <Tooltip title="Clear Remove">
                      <ClearIcon />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
            )}
          </Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 2, md: 4, lg: 4, xl: 8 }}
            columns={{ xs: 1, sm: 4, md: 4, lg: 6, xl: 8 }}
          >
            {members.map((member, index) => (
              <Grid item xs={1} sm={2} md={2} lg={2} xl={2} key={index}>
                <Card
                  variant="outlined"
                  sx={{ opacity: isFetching ? ".7" : "1s" }}
                >
                  <CardActionArea
                    disabled={isFetching}
                    onClick={handleCardClick(index)}
                  >
                    <Box
                      display="grid"
                      sx={{
                        position: "relative",
                        padding: {
                          xs: theme.spacing(2),
                          sm: theme.spacing(2),
                          md: theme.spacing(4),
                          lg: theme.spacing(4),
                          xl: theme.spacing(8),
                        },
                        placeItems: "center",
                        gap: theme.spacing(2),
                      }}
                    >
                      {removeMode && (
                        <Checkbox
                          checked={removeList.includes(index)}
                          sx={{ position: "absolute", right: 0, top: 0 }}
                          onChange={handleRemoveSelection(index)}
                        />
                      )}
                      {isLoading ? (
                        <Skeleton animation="wave" variant="circular">
                          <Avatar
                            // alt={member.name}
                            // src={member.image}
                            sx={{ width: "86px", height: "86px" }}
                          ></Avatar>
                        </Skeleton>
                      ) : (
                        <Avatar
                          alt={member.name}
                          src={member.image}
                          sx={{ width: "86px", height: "86px" }}
                        ></Avatar>
                      )}
                      <Box display="grid" sx={{ placeItems: "center" }}>
                        {isLoading ? (
                          <>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              width="100%"
                            >
                              <Typography
                                variant="h6"
                                fontWeight={theme.typography.fontWeightMedium}
                              >
                                {".".repeat(10)}
                              </Typography>
                            </Skeleton>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              width="100%"
                            >
                              <Typography variant="subtitle1">
                                {".".repeat(22)}
                              </Typography>
                            </Skeleton>
                          </>
                        ) : (
                          <>
                            <Typography
                              variant="h6"
                              fontWeight={theme.typography.fontWeightMedium}
                            >
                              {member.name}
                            </Typography>
                            <Typography variant="subtitle1">
                              {member.role}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, 250px)"
            gridTemplateRows="repeat(auto-fill, 250px)"
            justifyContent="center"
            gap={{
              mobile: "16px",
              tablet: "32px",
            }}
          >
            {team.map((member, index) => (
              <Paper
                key={member.name}
                variant="outlined"
                sx={{
                  position: "relative",
                  padding: {
                    mobile: "16px",
                    tablet: "32px",
                  },
                }}
              >
                {selectMode && (
                  <Checkbox
                    sx={{ position: "absolute", right: 0, top: 0 }}
                    onChange={handleSelection(index)}
                  />
                )}
                <Box display="grid" sx={{ placeItems: "center", gap: "16px" }}>
                  <Avatar
                    alt={member.name}
                    src={member.image}
                    sx={{ width: "80px", height: "80px" }}
                  ></Avatar>
                  <Box display="grid" sx={{ placeItems: "center" }}>
                    <Typography
                      variant="h5"
                      fontWeight={theme.typography.fontWeightMedium}
                    >
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1">{member.role}</Typography>
                    <Typography variant="subtitle1">{member.email}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box> */}
        </Box>
      </Admin>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDialogAdd}
        onClose={handleDialogAddClose}
      >
        {/* <DialogTitle></DialogTitle> */}
        <DialogTitle display="flex" alignItems="center">
          <Typography component="div" variant="h6" sx={{ flexGrow: 1 }}>
            {dialogValue.id ? "Update" : "Create"} Member
          </Typography>
          <IconButton aria-label="close" onClick={handleDialogAddClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={dialogValue}
            onSubmit={handleCreateOrUpdateMember}
          >
            {({
              values,
              errors,
              isSubmitting,
              setFieldValue,
              handleSubmit,
            }) => (
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Box display="grid" gap={theme.spacing(2)}>
                  <TextField
                    autoFocus
                    required
                    label="Name"
                    name="name"
                    type="text"
                    autoComplete="username"
                    value={values.name}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isSubmitting}
                    onChange={(evt) => setFieldValue("name", evt.target.value)}
                  ></TextField>
                  <TextField
                    required
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                    onChange={(evt) => setFieldValue("email", evt.target.value)}
                  ></TextField>
                  <FormControl fullWidth>
                    <InputLabel id="l-role">Role</InputLabel>
                    <Select
                      required
                      labelId="l-role"
                      label="Role"
                      name="role"
                      value={values.role}
                      disabled={isSubmitting}
                      onChange={(evt) =>
                        setFieldValue("role", evt.target.value)
                      }
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.name} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      required={!dialogValue.id}
                      id="password"
                      label="Password"
                      name="password"
                      autoComplete="new-password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      disabled={isSubmitting}
                      onChange={(evt) =>
                        setFieldValue("password", evt.target.value)
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            edge="end"
                            onClick={() =>
                              setFieldValue(
                                "showPassword",
                                !values.showPassword
                              )
                            }
                          >
                            {values.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Button
                    disableElevation
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {dialogValue.id ? "Update" : "Create"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleDialogAddClose}>Cancel</Button>
          <Button onClick={handleDialogAddClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are your sure want to Remove {removeList.length} Member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleRemoveMember}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        key={snack.id}
        anchorOrigin={{
          vertical: snack.vertical,
          horizontal: snack.horizontal,
        }}
        open={snack.open}
        autoHideDuration={snack.timeout}
        onClose={handleCloseSnack}
      >
        {snack.message}
      </Snackbar>
    </Page>
  );
}
