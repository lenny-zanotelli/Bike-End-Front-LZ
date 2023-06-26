/* eslint-disable consistent-return */
import {
  Card, CardContent, CardMedia, Container, Grid, IconButton, Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCallback, useEffect, useState } from 'react';
import { Journey } from '../../../@types/journey';
import { setFavoriteCard, sendFavoriteCard, removeFavoriteCard } from '../../../store/reducers/favorite';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import MainLayout from '../../MainLayout';
import { generateRandomImageUrl } from '../../../utils/randomImage';
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
    margin: 'auto',
    position: 'relative',
    border: 'solid 1px',
  },
  image: {
    opacity: 0.2,
    backgroundSize: 'cover',
  },
  content: {
    display: 'block',
    position: 'absolute',
    bottom: 0,
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '70%',
    width: '100%',
  },
  favoriteIcon: {
    top: '8px',
    left: '8px',
    position: 'absolute',
    zIndex: '1',
  },

} as const;

function ResultsPage() {
  const MAX_NAME_LENGTH = 20;
  const [storedJourneysArray, setStoredJourneysArray] = useState<Journey[]>([]);
  const favorites = useAppSelector((state) => state.favorite.favorite);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const results = localStorage.getItem('results');
    if (results) {
      const localStorageResults = JSON.parse(results);
      const updatedResults = localStorageResults.map((result: Journey) => ({
        ...result,
        imageUrl: generateRandomImageUrl(),
      }));
      setStoredJourneysArray(updatedResults);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteClick = useCallback((index: number) => {
    setStoredJourneysArray((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index].isFavorite = !updatedResults[index].isFavorite;
      return updatedResults;
    });
    const card = storedJourneysArray[index];
    const cardId = card.queryUrl;

    if (!card.isFavorite) {
      dispatch(removeFavoriteCard(cardId));
    } else {
      dispatch(setFavoriteCard(card));
      dispatch(sendFavoriteCard(card));
    }
  }, [dispatch, storedJourneysArray]);

  return (
    <MainLayout>
      <Container component="main" maxWidth={false} sx={{ height: '87vh', overflow: 'auto' }}>
        <Typography
          component="h2"
          color="black"
          align="center"
          sx={{
            fontSize: '1em',
            fontWeight: 'bold',
          }}
        >
          {`De nouveaux horizons à découvrir depuis 
        ${storedJourneysArray.length > 0 ? storedJourneysArray[0].from.name : ''}. 
        En selle !`}
        </Typography>
        <Grid
          component="section"
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
        >
          {storedJourneysArray.map((result: Journey, index: number) => (
            <Grid
              component="article"
              item
              key={result.to.id}
              xs={5}
              sm={8}
              md={3}
            >
              <Card sx={styles.card}>
                <IconButton
                  sx={styles.favoriteIcon}
                  onClick={() => handleFavoriteClick(index)}
                >
                  <FavoriteIcon sx={{ color: result.isFavorite ? 'red' : 'inherit' }} />
                </IconButton>
                <CardMedia
                  sx={styles.image}
                  component="img"
                  src={result.imageUrl}
                  alt={result.to.name}
                />
                <CardContent sx={styles.content}>
                  <Typography
                    color="black"
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.8em',
                    }}
                  >
                    {result.to.name.slice(0, MAX_NAME_LENGTH)}
                    {result.to.name.length > MAX_NAME_LENGTH ? '...' : ''}
                  </Typography>
                  <Typography
                    color="black"
                    align="center"
                    sx={{ fontSize: '0.8em' }}
                  >
                    {formatDuration(result.duration)}

                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>

  );
}

export default ResultsPage;
