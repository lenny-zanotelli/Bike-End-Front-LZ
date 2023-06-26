/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  KeysOfCredentials,
  changeCredentialsField,
  deleteUser,
  logout,
  modifyUser,
  fetchUser,
} from '../../../store/reducers/login';
import MainLayout from '../../MainLayout';

const styles = {
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '80vh',
    gap: '1rem',
  },
  containerAccount: {
    mt: '1rem',
    borderRadius: '5px',
    p: '1rem',
    textAlign: 'center',
    backgroundColor: 'rgb(154, 183, 192, 0.3)',
  },
  containerAccountTitle: {
    fontSize: '2rem',
    py: '1rem',
    px: '2rem',
  },
  containerCreateAccountTitle: {
    fontSize: '1.25em',
    mb: '1rem',
    py: '1rem',
    px: '2rem',
  },
  buttonStyle: {
    minWidth: '20rem',
    mt: '1rem',
    py: '0.7rem',
    px: '1.5rem',
    backgroundColor: 'grey',
    ':hover': {
      backgroundColor: 'lightgrey',
      color: 'black',
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
  containerModal: {
    position: 'relative',
    width: '70vw',
    mt: '2rem',
    borderRadius: '5px',
    textAlign: 'center',
    backgroundColor: 'rgb(154, 183, 192, 1)',
    '@media screen and (min-width : 900px)': {
      maxWidth: '35rem',
    },
  },
  closeButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '-0.5rem',
  },
  deleteAccountButton: {
    my: '1rem',
    fontSize: '0.7rem',
  },
};

function MyAccount() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { firstname, lastname, email } = useAppSelector(
    (state) => state.login.credentials,
  );
    // MODAL
  const [open, setOpen] = useState(false);

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const fieldName = event.target.name as KeysOfCredentials;
    dispatch(
      changeCredentialsField({
        propertyKey: fieldName,
        value: newValue,
      }),
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleLoggout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleUpdateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(modifyUser());
    setOpen(false);
  };

  const handleDeleteUser = () => {
    dispatch(deleteUser());
    navigate('/');
  };

  useEffect(() => {
    dispatch(fetchUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <Container
        component="main"
        className="container"
        sx={styles.mainContainer}
      >
        <Typography
          variant="h1"
          className="container__account__title"
          sx={styles.containerAccountTitle}
        >
          Mon compte
        </Typography>
        <Box
          className="container__connect"
          component="section"
          sx={styles.containerAccount}
        >
          <Typography
            variant="h2"
            className="container__createAccount__title"
            sx={styles.containerCreateAccountTitle}
          >
            MES INFORMATIONS
            <Button
              startIcon={<EditIcon />}
              onClick={handleOpen}
              sx={{
                position: 'absolute',
              }}
            />
          </Typography>
          <Modal
            open={open}
            onClose={handleClose}
            sx={{
              mt: '6.5rem',
            }}
          >
            <Container
              sx={styles.containerModal}
            >
              <Button
                onClick={() => setOpen(false)}
                sx={styles.closeButton}
              >
                <CloseIcon />
              </Button>
              <form onSubmit={handleUpdateUser}>
                <Typography
                  variant="h2"
                  className="container__createAccount__title"
                  sx={styles.containerCreateAccountTitle}
                >
                  Modifier vos informations
                </Typography>
                <TextField
                  sx={styles.inputStyle}
                  color="success"
                  name="lastname"
                  label="Nom"
                  size="small"
                  onChange={handleChangeField}
                />
                <TextField
                  sx={styles.inputStyle}
                  color="success"
                  name="firstname"
                  label="Prenom"
                  size="small"
                  onChange={handleChangeField}
                />
                <TextField
                  sx={styles.inputStyle}
                  color="success"
                  type="email"
                  name="email"
                  label="Email"
                  size="small"
                  onChange={handleChangeField}
                />
                <Button
                  type="submit"
                  sx={{
                    mt: '2rem',
                    mb: '2rem',
                  }}
                  variant="contained"
                  color="primary"
                >
                  Mettre à jour
                </Button>
              </form>
            </Container>
          </Modal>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={lastname} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={firstname} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Link to="/favorite">
          <MuiLink
            sx={{
              mt: '2rem',
              mb: '2rem',
            }}
            underline="hover"
          >
            <FavoriteIcon />
            Mes voyages favoris
          </MuiLink>
        </Link>
        <Button
          type="submit"
          sx={styles.buttonStyle}
          variant="contained"
          onClick={handleLoggout}
        >
          Se deconnecter
        </Button>
        <Button
          type="submit"
          size="small"
          sx={styles.deleteAccountButton}
          onClick={handleDeleteUser}
        >
          Supprimer mon compte
        </Button>
      </Container>
    </MainLayout>
  );
}

export default MyAccount;
