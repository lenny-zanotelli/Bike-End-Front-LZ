import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Container, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'center',
    my: '0.5rem',
    '@media screen and (min-width : 900px)': {
      display: 'flex',
      gap: '8rem',
      alignItems: 'center',
      textAlign: 'center',
      width: '100vw',
      height: '5rem',
      px: '3rem',
      m: '0',
      marginBottom: '1rem',
      background: '#D1EFEC',
    },
  },
  headerTitleTagline: {
    display: 'none',
    '@media screen and (min-width : 900px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  headerTagline: {
    '@media screen and (min-width: 900px)': {
      paddingLeft: '0.7rem',
      fontSize: '1.25rem',
    },
  },
  headerTitle: {
    fontSize: '2rem',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  headerContainerRightIcons: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
    '@media screen and (min-width: 900px)': {
      width: 'auto',
    },
  },
} as const;

function HeaderLoggedIn() {
  return (
    <Container
      component="header"
      className="header"
      maxWidth={false}
      sx={styles.header}
    >
      <Link
        className="header__link"
        to="/"
      >
        <TravelExploreRoundedIcon
          fontSize="large"
          color="action"
        />
      </Link>
      <Container
        component="section"
        className="header__title-tagline"
        sx={styles.headerTitleTagline}

      >
        <Typography
          component="h2"
          className="header__title hidden"
          sx={styles.headerTitle}
        >
          BikeEnd
        </Typography>
        <Typography
          className="header__tagline hidden"
          sx={styles.headerTagline}
        >
          Le planificateur des week-ends qui font du bien à la tête et à la planète !
        </Typography>
      </Container>
      <Container
        component="section"
        disableGutters
        className="header__container-right-icons"
        sx={styles.headerContainerRightIcons}
      >
        <Link
          className="header__link"
          to="/favorite"
        >
          <FavoriteIcon
            fontSize="large"
            color="action"
          />
        </Link>
        <Link
          className="header__link"
          to="/myaccount"
        >
          <AccountCircleRoundedIcon
            fontSize="large"
            color="action"
          />
        </Link>
      </Container>
    </Container>
  );
}

export default HeaderLoggedIn;
