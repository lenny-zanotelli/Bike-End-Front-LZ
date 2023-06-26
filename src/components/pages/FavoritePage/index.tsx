import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import {
  FormEvent, useEffect, useState,
} from 'react';
import { Journey } from '../../../@types/journey';
import {
  getAllFavorite,
  removeFavoriteCard,
  sendFavoriteCard,
  updateFavoriteComment,
  setDisplaySnackbar,
} from '../../../store/reducers/favorite';
import { generateRandomImageUrl } from '../../../utils/randomImage';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import MainLayout from '../../MainLayout';
import AlertMessage from '../../AlertMessage';
import { formatDuration } from '../../../utils/formatDuration';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    width: '80%',
    height: '100vh',
    overflow: 'auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    position: 'relative',
    border: 'solid 1px',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '0.8em',
  },
  image: {
    opacity: 0.2,
    backgroundSize: 'cover',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'absolute',
    bottom: 0,
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    width: '100%',
  },
  favoriteIcon: {
    top: '8px',
    left: '8px',
    position: 'absolute',
    zIndex: '1',
  },
  addCommentIcon: {
    top: '8px',
    right: '8px',
    position: 'absolute',
    zIndex: '1',
  },
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 30,
    p: 4,
  },
} as const;

function FavoritePage() {
  const MAX_NAME_LENGTH = 20;
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorite.favorite);
  const { open } = useAppSelector((state) => state.favorite.alert);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQueryUrl, setSelectedQueryUrl] = useState('');
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    dispatch(getAllFavorite());
  }, [dispatch]);

  const handleFavoriteClick = (journey: Journey) => {
    const isFavorite = favorites.some((favorite) => favorite.to.id === journey.to.id);
    if (isFavorite) {
      dispatch(removeFavoriteCard(journey.queryUrl)).then(() => {
        dispatch(setDisplaySnackbar({ severity: 'success', message: 'Ton favori a bien été supprimé' }));

        // Suppression réussie, mettez à jour l'état des favoris dans le store
        dispatch(getAllFavorite());
      });
    } else {
      dispatch(sendFavoriteCard(journey)).then(() => {
        // Ajout réussi, mettez à jour l'état des favoris dans le store
        dispatch(getAllFavorite());
      });
    }
  };

  const handleOpenModal = (queryUrl: string) => {
    setSelectedQueryUrl(queryUrl);
    const favorite = favorites.find((fav) => fav.queryUrl === queryUrl);
    if (favorite) {
      setCommentValue(favorite.comment || '');
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUpdateComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateFavoriteComment({ queryUrl: selectedQueryUrl, comment: commentValue }));
    dispatch(setDisplaySnackbar({ severity: 'success', message: 'Ton commentaire a bien été ajouté ou modifié' }));
    handleCloseModal();
  };

  return (
    <MainLayout>
      <Container
        component="main"
        maxWidth={false}
        sx={{ height: '80vh', overflow: 'auto' }}
      >
        <Typography
          component="h2"
          color="black"
          align="center"
          sx={{
            fontSize: '1em',
            fontWeight: 'bold',
          }}
        >
          Favoris
        </Typography>
        <Grid
          component="section"
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
        >

          {favorites.length ? favorites.map((favorite) => (
            <Grid
              component="article"
              item
              key={favorite.to.id}
              xs={5}
              sm={8}
              md={3}
            >
              <Card sx={styles.card}>
                <IconButton
                  sx={styles.favoriteIcon}
                  onClick={() => handleFavoriteClick(favorite)}
                >
                  <FavoriteIcon sx={{ color: 'red' }} />
                </IconButton>
                <IconButton
                  sx={styles.addCommentIcon}
                  onClick={() => handleOpenModal(favorite.queryUrl)}
                >
                  <AddCommentRoundedIcon />
                </IconButton>
                <CardMedia
                  sx={styles.image}
                  component="img"
                  image={generateRandomImageUrl()}
                  alt={favorite.to.name}
                />
                <CardContent sx={styles.content}>
                  <Typography
                    color="black"
                    align="center"
                    sx={styles.cardTitle}
                  >
                    {favorite.to.name.slice(0, MAX_NAME_LENGTH)}
                    {favorite.to.name.length > MAX_NAME_LENGTH ? '...' : ''}
                  </Typography>
                  <Typography color="black" align="center" sx={{ fontSize: '0.8em' }}>
                    {formatDuration(favorite.duration)}
                  </Typography>
                  {favorite.comment ? (
                    <Typography
                      color="black"
                      align="center"
                      onClick={() => handleOpenModal(favorite.queryUrl)}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.8em',
                        border: '1px solid grey',
                        borderRadius: '5px',
                      }}
                    >
                      {favorite.comment}
                    </Typography>
                  ) : ''}
                </CardContent>
                {/* MODAL */}
                <Modal open={openModal} onClose={handleCloseModal}>
                  <Container sx={styles.modalContainer}>
                    <Card>
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Typography variant="h6">Modifier le commentaire</Typography>
                        <form onSubmit={handleUpdateComment}>
                          <TextField
                            label="Commentaire"
                            name="comment"
                            defaultValue={commentValue}
                            onChange={(event) => setCommentValue(event.target.value)}
                            fullWidth
                          />
                          <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            sx={{ mt: '0.5rem' }}
                          >
                            Enregistrer
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </Container>
                </Modal>
              </Card>
            </Grid>
          )) : (
            <Typography
              variant="h2"
              sx={{ mt: '4rem', fontSize: '1rem', pl: '1rem' }}
            >
              Aucun favori actuellement
            </Typography>
          )}
        </Grid>

        {open && (
        <AlertMessage />
        )}
      </Container>
    </MainLayout>
  );
}

export default FavoritePage;
