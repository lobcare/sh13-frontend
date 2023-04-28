import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Header, Sidebar } from "./components";
import { headerAction } from "store/Header";
import { SHTitle, SHSelect } from "components";

const useStyles = () => {
  const theme = useTheme();
  return {
    root: {
      boxShadow: "none",
      backgroundImage: "unset",
    },
    content: {
      height: "100vh",
      overflow: "auto",
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      paddingTop: theme.spacing(6.5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    fullContent: {
      marginLeft: "250px",
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  };
};

function DashboardLayout() {
  const classes = useStyles();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.header.profile);
  const accessToken = window.sessionStorage.getItem("access_token");
  const [extended, setExtended] = useState(true);
  const calledOnce = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (accessToken && profile === null) {
      dispatch(headerAction.getUserInfo(accessToken));
      calledOnce.current = true;
    }
  }, [dispatch, profile, accessToken]);

  useEffect(() => {
    if (!accessToken && profile === null) {
      navigate("/auth/login", { replace: true });
    }
  }, [profile, accessToken, navigate]);

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleExtended = () => {
    setExtended(!extended);
  };
  var title = "";
  useEffect(() => {
    var pathname = window.location.pathname.split('/').splice(-1)[0];
    const firstLetter = pathname.charAt(0)
    const firstLetterCap = firstLetter.toUpperCase()
    const remainingLetters = pathname.slice(1)
    title = firstLetterCap + remainingLetters
  },[])

  return (
    <Fragment>
      <Header sidebarHandle={handleExtended} />
      <Sidebar extended={extended} />
      <Box
        component="div"
        sx={[classes.content, extended && classes.fullContent]}
      >
        <SHTitle title={title} />
        <Outlet />
      </Box>
    </Fragment>
  );
}

export default DashboardLayout;
