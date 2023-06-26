import {
  Button,
  TextField,
  Checkbox,
  Container,
  FormControlLabel,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  KeysOfCredentials,
  changeCredentialsField,
  register,
  setDisplaySnackbar,
  toggleAcceptedConditions,
} from '../../../store/reducers/login';
import AlertMessage from '../../AlertMessage';
import MainLayout from '../../MainLayout';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    mt: '1.5rem',
  },
  containerCreateAccount: {
    width: '80vw',
    borderRadius: '5px',
    py: '1rem',
    textAlign: 'center',
    backgroundColor: 'rgb(154, 183, 192, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    mt: '0.5rem',
    py: '0.7rem',
    px: '1.5rem',
    backgroundColor: '#4CAF50',
    ':hover': {
      backgroundColor: '#4CAF50',
    },
    color: 'white',
    border: 'none',
    borderRadius: '3px',
  },
  inputStyle: {
    width: '80%',
    my: '0.5rem',
    backgroundColor: 'white',
  },
  alreadyAnAccount: {
    my: '0.5rem',
    fontSize: '0.6rem',
    color: 'black',
  },
  alreadyAnAccountSpan: {
    my: '1rem',
    fontSize: '0.6rem',
    color: 'blue',
    pl: '0.3rem',
  },
  containerText: {
    width: '80%',
    textAlign: 'center',
    fontSize: '0.7rem',
    mt: '0.5rem',
    fontStyle: 'italic',
  },
  containerFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

function SignupPage() {
  // This regex matches only when all the following are true:
  // password must contain 1 number (0-9)
  // password must contain 1 uppercase letters
  // password must contain 1 lowercase letters
  // password must contain 1 non-alpha numeric number
  // password is 8-16 characters with no space
  const PWD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
  const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,10}$/;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    email, password, firstname, lastname, passwordCheck,
  } = useAppSelector((state) => state.login.credentials);
  const acceptedConditions = useAppSelector((state) => state.login.acceptedConditions);
  const isLogged = useAppSelector((state) => state.login.logged);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const fieldName = event.target.name as KeysOfCredentials;
    dispatch(changeCredentialsField({
      propertyKey: fieldName,
      value: newValue,
    }));
  };

  const handleChangeCheckBox = () => {
    dispatch(toggleAcceptedConditions());
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordCheck) {
      dispatch(setDisplaySnackbar({ severity: 'error', message: 'Les mots de passe saisis ne sont pas identitiques' }));
      return;
    }
    if (!PWD_REGEX.test(password)) {
      dispatch(setDisplaySnackbar({ severity: 'error', message: 'Votre mot de passe doit avoir une taille d\'au moins 8 charactères, maximum 16 caractères et contenir: une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial' }));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      dispatch(setDisplaySnackbar({ severity: 'error', message: 'Votre email doit être au bon format : example@domain.xyz' }));
      return;
    }
    dispatch(register());
  };

  useEffect(() => {
    if (isLogged) {
      navigate('/');
    }
  }, [isLogged, navigate]);

  return (
    <MainLayout>
      <Container
        className="container"
        sx={styles.container}
      >
        <Container
          className="container__createAccount"
          maxWidth="sm"
          sx={styles.containerCreateAccount}
        >
          <Typography
            variant="h2"
            className="container__createAccount__title"
            sx={{
              fontSize: '1.8em',
              mb: '1rem',
            }}
          >
            Créer mon compte
          </Typography>
          <form
            className="container__createAccount__form"
            onSubmit={handleSubmitForm}
          >
            <TextField
            // TODO Créer des errors sous les TextField pour informer l'user
              sx={styles.inputStyle}
              color="success"
              fullWidth
              required
              name="firstname"
              label="Prénom"
              value={firstname}
              onChange={handleChangeField}
              size="small"
            />
            <TextField
              required
              sx={styles.inputStyle}
              color="success"
              name="lastname"
              label="Nom"
              value={lastname}
              onChange={handleChangeField}
              size="small"
            />
            <TextField
              required
              sx={styles.inputStyle}
              color="success"
              type="email"
              name="email"
              label="Adresse e-mail"
              value={email}
              onChange={handleChangeField}
              size="small"
            />
            <TextField
              required
              sx={styles.inputStyle}
              color="success"
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Mot de passe"
              value={password}
              onChange={handleChangeField}
              size="small"
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
            <TextField
              required
              sx={styles.inputStyle}
              color="success"
              type={showPassword ? 'text' : 'password'}
              name="passwordCheck"
              label="Confirmer le mot de passe"
              value={passwordCheck}
              onChange={handleChangeField}
              size="small"
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
            <div className="container__createAccount__form_cgu">
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={acceptedConditions}
                    onChange={handleChangeCheckBox}
                    color="success"
                  />
                  )}
                label="J'accepte les CGU"
              />
            </div>
            <Box
              sx={styles.containerFooter}
            >
              <Link
                href="/login"
                sx={styles.alreadyAnAccount}
                underline="none"
                variant="button"
              >
                Déjà un compte ?
                <Typography
                  component="span"
                  sx={styles.alreadyAnAccountSpan}
                >
                  Connectez vous !
                </Typography>
              </Link>
              <Button
                type="submit"
                sx={styles.buttonStyle}
                variant="contained"
              >
                Valider
              </Button>
            </Box>
          </form>
        </Container>
        <Typography
          className="container__text"
          paragraph
          sx={styles.containerText}
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad, dicta earum vero.
        </Typography>
        {!isLogged && (
        <AlertMessage />
        )}
      </Container>
    </MainLayout>
  );
}

export default SignupPage;
