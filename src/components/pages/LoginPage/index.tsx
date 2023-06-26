/* eslint-disable react/jsx-no-bind */
import {
  Button,
  Container,
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { VisibilityOff, Visibility } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  login,
  KeysOfCredentials,
  changeCredentialsField,
  updateLoginStatus,
  setDisplaySnackbar,
} from '../../../store/reducers/login';
import AlertMessage from '../../AlertMessage';
import MainLayout from '../../MainLayout';

const styles = {
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  containerConnect: {
    display: 'flex',
    flexDirection: 'column',
    mt: '3rem',
    borderRadius: '5px',
    p: '1rem',
    textAlign: 'center',
    backgroundColor: 'rgb(154, 183, 192, 0.3)',
    '@media only screen and (min-device-width : 900px)': {
      width: '25rem',
    },
  },
  containerConnectTitle: {
    fontSize: '2rem',
    py: '1rem',
    px: '2rem',
  },
  input: {
    width: '80%',
    my: '0.5rem',
    backgroundColor: 'white',
  },
  containerConnectFormBtn: {
    my: '1rem',
    backgroundColor: '#207868',
    ':hover': {
      backgroundColor: '#0b5447',
    },
  },
  containerConnectForgotPassword: {
    my: '1rem',
    fontSize: '0.6rem',
    color: 'black',
  },
  createAccountSpan: {
    my: '1rem',
    fontSize: '0.6rem',
    color: 'blue',
    pl: '0.3rem',
  },
};

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { email, password } = useAppSelector((state) => state.login.credentials);
  const isLogged = useAppSelector((state) => state.login.logged);
  const error = useAppSelector((state) => state.login.error);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleChangeField(event: ChangeEvent<HTMLInputElement>): void {
    const newValue = event.target.value;
    const fieldName = event.target.name as KeysOfCredentials;
    dispatch(changeCredentialsField({
      propertyKey: fieldName,
      value: newValue,
    }));
  }

  function handleSubmitLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    dispatch(setDisplaySnackbar({ severity: 'error', message: 'Email ou mot de passe incorrect' }));
    dispatch(login());
  }

  useEffect(() => {
    if (isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isUserLogged = Boolean(token);
    dispatch(updateLoginStatus(isUserLogged));
  });

  return (
    <MainLayout>
      <Container
        className="container"
        component="main"
        sx={styles.mainContainer}
      >
        <Box
          className="container__connect"
          component="section"
          sx={styles.containerConnect}
        >
          <Typography
            className="container__connect__title"
            component="h2"
            sx={styles.containerConnectTitle}
          >
            Connexion
          </Typography>
          <form
            className="container__connect__form"
            onSubmit={handleSubmitLogin}
          >
            <TextField
              error={Boolean(error)}
              sx={styles.input}
              color="success"
              variant="outlined"
              margin="normal"
              required
              id="email"
              label="Adresse email"
              name="email"
              value={email}
              onChange={handleChangeField}
            />
            <TextField
              error={Boolean(error)}
              sx={styles.input}
              color="success"
              variant="outlined"
              margin="normal"
              required
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handleChangeField}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              className="container__connect__form-btn"
              sx={styles.containerConnectFormBtn}
              type="submit"
              size="large"
              variant="contained"
            >
              Valider
            </Button>
          </form>

          <Link to="/signup">
            <MuiLink
              sx={styles.containerConnectForgotPassword}
              underline="none"
              variant="button"
            >

              Pas de compte ?
              <Typography
                component="span"
                sx={styles.createAccountSpan}
              >
                Créez un compte !
              </Typography>

            </MuiLink>
          </Link>
          <Button
            className="container__connect__forgotPassword"
            size="small"
            sx={styles.containerConnectForgotPassword}
          >
            Mot de passe oublié ?
          </Button>
          {error && (
            <AlertMessage />
          )}
        </Box>
      </Container>
    </MainLayout>
  );
}

export default LoginPage;
