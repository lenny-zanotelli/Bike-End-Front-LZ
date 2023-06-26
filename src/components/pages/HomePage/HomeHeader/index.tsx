import { Box, Typography } from '@mui/material';
import banner from '../../../../assets/images/hero-banner.jpg';

const styles = {
  headerContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '50vh',
  },
  headerTitle: {
    position: 'absolute',
    fontSize: '3.5rem',
    fontWeight: 'bolder',
    fontStyle: 'italic',
    '@media screen and (min-width: 900px)': {
      fontSize: '8rem',
    },
  },
};

function HomeHeader() {
  return (
    <Box
      className="header__container"
      component="header"
      sx={styles.headerContainer}
    >
      <img
        className="header__banner"
        src={banner}
        alt="hero banner"
      />
      <Typography
        className="header__title"
        variant="h1"
        sx={styles.headerTitle}
      >
        BIKE END
      </Typography>
    </Box>

  );
}

export default HomeHeader;
