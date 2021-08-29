import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import SearchProperty from "./components/SearchProperty/SearchProperty";
import "./App.scss";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function App(props) {
  return (
    <div className="app-root">
      <HideOnScroll {...props}>
        <AppBar className="appBar" position="sticky">
          <Toolbar>
            <Typography variant="subtitle1" className="header-label">
              TechPhantoms
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <SearchProperty />
    </div>
  );
}

export default App;
