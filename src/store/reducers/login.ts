import { createAction, createReducer } from '@reduxjs/toolkit';
import { axiosInstance as axios } from '../../utils/axios';
import { createAppAsyncThunk } from '../../utils/redux';
import { getUserDataFromLocalStorage, removeUserDataFromLocalStorage } from '../../utils/localStorageUserData';

interface LoginStates {
  logged: boolean;
  credentials: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordCheck: string;
  },
  acceptedConditions: boolean;
  isLoading: boolean;
  error: string | null;
  token: string;
  alert: {
    open: boolean;
    severity: string;
    message: string;
  }
}

// Récupération de données dans le localStorage
const userData = getUserDataFromLocalStorage();
const savedToken = localStorage.getItem('token');

const initialState: LoginStates = {
  logged: false,
  credentials: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    passwordCheck: '',
  },
  acceptedConditions: false,
  isLoading: false,
  error: null,
  token: savedToken || '',
  alert: {
    open: false,
    severity: 'success',
    message: '',
  },
  ...userData,
};

// MONINTERFACE['propriété'] permet de récupérer le typage d'un propriété.
// 'type' me permet de créer un type comme 'interface'
// Car 'interface' est obligatoirement un objet
// Donc avec 'type' cela peut être une ou des valeurs.
export type KeysOfCredentials = keyof LoginStates['credentials'];
export const toggleAcceptedConditions = createAction('login/ACCEPTED_CONDITIONS');

export const login = createAppAsyncThunk(
  'login/LOGIN',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const { email, password } = state.login.credentials;
    const { data } = await axios.post('/login', {
      email,
      password,
    });
    localStorage.setItem('token', JSON.stringify(data));
    return data;
  },
);

export const register = createAppAsyncThunk(
  'login/REGISTER',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    // const body = JSON.stringify(newUser);
    const {
      firstname, lastname, email, password,
    } = state.login.credentials;
    const { acceptedConditions } = state.login;
    const { data } = await axios.post('/signup', {
      firstname,
      lastname,
      email,
      password,
      acceptedConditions,
    });
    localStorage.setItem('token', JSON.stringify(data));
    return data;
  },
);

export const deleteUser = createAppAsyncThunk('login/DELETE_USER', async () => {
  try {
    await axios.delete('/user');
  } catch (error) {
    console.log(error);
  }
});

// eslint-disable-next-line consistent-return
export const modifyUser = createAppAsyncThunk('login/MODIFY_USER', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const {
    firstname, lastname, email,
  } = state.login.credentials;

  try {
    const response = await axios.patch('/user', {
      firstname,
      lastname,
      email,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

// eslint-disable-next-line consistent-return
export const fetchUser = createAppAsyncThunk('user/FETCH_USER', async () => {
  try {
    const response = await axios.get('/user');
    const res = response.data;
    console.log(response);
    return res;
  } catch (error) {
    console.log(error);
  }
});

export const logout = createAction('login/LOGOUT');

export const changeCredentialsField = createAction<{
  propertyKey: KeysOfCredentials
  value: string;
}>('login/CHANGE_CREDENTIALS_FIELD');

export const updateLoginStatus = createAction<boolean>('login/UPDATE_LOGIN_STATUS');

export const setDisplaySnackbar = createAction<{
  severity: string; message: string
}>('login/SET_DISPLAY_SNACKBAR');

const loginReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(updateLoginStatus, (state, action) => {
      state.logged = action.payload;
    })
    .addCase(toggleAcceptedConditions, (state) => {
      state.acceptedConditions = !state.acceptedConditions;
    })
    .addCase(changeCredentialsField, (state, action) => {
      state.credentials[action.payload.propertyKey] = action.payload.value;
    })
    .addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.credentials.firstname = action.payload.firstname;
      state.credentials.lastname = action.payload.lastname;
      state.credentials.email = action.payload.email;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(login.rejected, (state) => {
      state.error = 'Email ou mot de passe incorrect';
      state.isLoading = false;
    })
    .addCase(login.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.logged = true;
      state.isLoading = false;
      state.token = action.payload.token;
      // Réinitialiser le state des credentials
      state.credentials.email = '';
      state.credentials.password = '';
    })
    // SIGNUP
    .addCase(register.rejected, (state) => {
      state.error = 'Il semble que le formulaire contient des erreurs';
      state.logged = false;
      state.isLoading = false;
    })
    .addCase(register.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.logged = true;
      state.isLoading = false;
      state.acceptedConditions = true;
      state.token = action.payload.token;
      // Réinitialiser le state des credentials
      state.credentials.email = '';
      state.credentials.password = '';
      state.credentials.passwordCheck = '';
    })
    // LOGOUT
    .addCase(logout, (state) => {
      state.logged = false;
      removeUserDataFromLocalStorage();
    })
  // DELETE USER
    .addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteUser.fulfilled, (state) => {
      state.logged = false;
      state.isLoading = false;
      state.error = null;
      removeUserDataFromLocalStorage();
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Une erreur est survenue';
    })
  // MODIFY USER
    .addCase(modifyUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(modifyUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.credentials.firstname = action.payload.firstname;
      state.credentials.lastname = action.payload.lastname;
      state.credentials.email = action.payload.email;
    })
    .addCase(modifyUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(setDisplaySnackbar, (state, action) => {
      state.alert.severity = action.payload ? action.payload.severity : state.alert.severity;
      state.alert.message = action.payload ? action.payload.message : '';
      state.alert.open = !state.alert.open;
    });
});

export default loginReducer;
