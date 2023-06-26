/* eslint-disable import/no-extraneous-dependencies */
import {
  Autocomplete,
  Button,
  Container,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { Image } from 'mui-image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import EuroRoundedIcon from '@mui/icons-material/EuroRounded';
// import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../MainLayout';
import testImg from '../../../assets/images/test-searchPage-desktop.jpg';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { searchJourneys } from '../../../store/reducers/search';
import { fetchAutoComplete } from '../../../store/reducers/autoComplete';

const styles = {
  container: {
    '@media screen and (min-width : 900px)': {
      maxWidth: '50%',
    },
  },
  containerTitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
    mt: '2rem',
    '@media screen and (min-width : 900px)': {
      fontWeight: 'bolder',
      fontSize: '1.8rem',
      paddingBottom: '0.5rem',
    },
  },
  containerSearchForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.7rem',
    px: '1.5rem',
    mt: '1rem',
  },
  searchFormFilterSection: {
    display: 'flex',
    justifyContent: 'space-between',
    px: '0',
  },
  searchFormInputFilter: {
    padding: '0.6rem',
    width: '40vw',
  },
  filterFormCriteria: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '100px',
    marginTop: '1.2rem',
  },
  filterFormTitle: {
    fontSize: '1.15rem',
    p: '1rem',
    height: '100%',
    width: '35%',
  },
  filterFormInput: {
    width: '60%',
  },
  filterFormBtn: {
    display: 'flex',
    flexDirection: 'column',
    mt: '1rem',
    gap: '0.8rem',
  },
  desktopContainer: {
    '@media screen and (min-width : 900px)': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  desktopContainerImg: {
    display: 'none',
    '@media screen and (min-width : 900px)': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  containerSubtitle: {
    display: 'none',
    '@media screen and (min-width : 900px)': {
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: '2rem',
    },
  },
  underline: {
    display: 'none',
    '@media screen and (min-width : 900px)': {
      color: '#9EADBA',
      display: 'block',
    },
  },

} as const;

function SearchPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.autoComplete.query);
  const searchParams = useAppSelector((state) => state.search.params);
  const maxDuration = useAppSelector((state) => state.search.params.max_duration);
  const journeys = useAppSelector((state) => state.search.journeys);
  const isLoading = useAppSelector((state) => state.search.loading);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  const handleAutoCompleteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    console.log(newValue);
    dispatch(fetchAutoComplete(newValue));
  };

  const handleMaxDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedParams = {
      ...searchParams,
      max_duration: parseInt(event.target.value, 10),
    };
    dispatch(searchJourneys(updatedParams));
  };

  const handleSelectedCityIdChange = (_event: unknown, value: string) => {
    const selectedCity = query.find((item: { name: string }) => item.name === value);
    if (selectedCity) {
      setSelectedCityId(selectedCity.id);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedParams = {
      ...searchParams,
      from: selectedCityId,
    };
    await dispatch(searchJourneys(updatedParams));
    navigate('/result');
  };

  useEffect(() => {
    // Enregistrer les résultats de recherche dans le localStorage
    localStorage.setItem('results', JSON.stringify(journeys));
  }, [journeys]);

  const uniqueOptions = Array.from(new Set(query?.map((item: { name: string }) => item.name)));

  return (
    <MainLayout>
      <Container
        className="desktop-container"
        sx={styles.desktopContainer}
      >
        <Container
          component="main"
          className="container"
          sx={styles.container}
        >
          <form onSubmit={handleSubmit}>
            <Typography
              component="h1"
              className="container__title"
              sx={styles.containerTitle}
            >
              De nouveaux horizons à découvrir. En selle !
            </Typography>
            <Typography
              component="h2"
              className="container__subtitle hidden"
              sx={styles.containerSubtitle}
            >
              Saisissez votre voyage
            </Typography>
            <Divider
              className="underline"
              sx={styles.underline}
            />
            <Container
              component="section"
              className="container__search-form"
              sx={styles.containerSearchForm}
            >
              <Autocomplete
                freeSolo
                disableClearable
                clearOnEscape
                noOptionsText="No Destination"
                options={uniqueOptions}
                disabled={isLoading}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    label="Lieu de départ"
                    margin="dense"
                    {...params}
                    className="search-form__input-city"
                    fullWidth
                    onChange={handleAutoCompleteChange}
                    name="city-start"
                    aria-placeholder="Lieu de départ"
                    color="success"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                      endAdornment: (
                        <InputAdornment position="end">
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                onChange={handleSelectedCityIdChange}
              />
              <Container
                component="article"
                className="search-form__filter-section"
                disableGutters
                sx={styles.searchFormFilterSection}
              >
                <TextField
                  fullWidth
                  className="search-form__input-filter"
                  sx={{ marginRight: '0.6rem' }}
                  type="date"
                  name="date"
                  value={new Date().toISOString().split('T')[0]}
                  color="success"
                  disabled={isLoading}
                />
                <TextField
                  fullWidth
                  className="search-form__input-filter"
                  value={new Date(maxDuration * 1000).toISOString().slice(11, 19)}
                  onChange={handleMaxDurationChange}
                  type="time"
                  name="time"
                  color="success"
                  disabled={isLoading}
                />
              </Container>
            </Container>
            <Container
              component="article"
              className="filter-form__btn"
              sx={styles.filterFormBtn}
            >
              <Button
                className="filter-form__btn-search"
                type="submit"
                size="large"
                variant="contained"
                color="success"
                disabled={isLoading}
              >
                Recherche
              </Button>
            </Container>
          </form>
        </Container>
        <Container
          className="desktop-container__img"
          sx={styles.desktopContainerImg}
        >
          <Image
            className="desktop-img hidden"
            src={testImg}
            alt="town"
            width={550}
            height={500}
            fit="cover"
            duration={1500}
            easing="cubic-bezier(0.7, 0, 0.6, 1)"
            shift="left"
            distance="500px"
            shiftDuration={900}
            style={{ paddingLeft: '6rem', marginTop: '9rem' }}
          />

        </Container>
      </Container>
    </MainLayout>

  );
}

export default SearchPage;
