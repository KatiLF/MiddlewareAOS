const express = require('express');
const cors = require('cors');
const {connect} = require('./utils/supabase');
const jwt = require('jsonwebtoken');
const app = express();
const secretToken = "M+Yidu6bWMk9GKkJopL0Sk+ri/RRcBFTF5DmxvbBZaJj+ouXBWzNeSb0qf+rG0GuLXqeD34vZ0RKH2LnS+0INw==";
app.use(express.json());
app.use(cors({
  origin: '*', // Asegúrate de que este origen coincida con el de tu cliente
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Ruta protegida
app.post('/', async (req, res) =>{
  const supabase = await connect();
  const authHeader = req.headers.authorization; 
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
  }

   jwt.verify(token, secretToken, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    console.log('Token decodificado:', decoded);
    const correo = decoded.email;
    const contrasena = decoded.pass;
    
    const result =  await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena
     });
     const { user, error } = result;

     if (error) {
        const token = jwt.sign("Credenciales no validas", secretToken);
        res.json(token);
        return;
     } else {
        const respuesta = jwt.sign(result, secretToken);
        res.json(respuesta);
     }
  });
});

app.post('/files/algebra', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
  }

  try {
    const supabase = await connect();
    const { data: files, error } = await supabase.storage.from('Ejemplo').list('Algebra');

    if (error) {
      throw error;
    }

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los archivos' });
  }
});

app.post('/files/calculo', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
  }

  try {
    const supabase = await connect();
    const { data: files, error } = await supabase.storage.from('Ejemplo').list('Calculo');

    if (error) {
      throw error;
    }

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los archivos' });
  }
});

app.post('/files/programacion', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
  }

  try {
    const supabase = await connect();
    const { data: files, error } = await supabase.storage.from('Ejemplo').list('Programacion');

    if (error) {
      throw error;
    }

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los archivos' });
  }
});

app.post('/registro', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const supabase = await connect();
  jwt.verify(token, secretToken, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    const correo = decoded.email;
    const contrasena = decoded.password;
    
    let result = await supabase.auth.signUp({
        email: correo,
        password: contrasena
     });
     const token = jwt.sign("Registro completado", secretToken);
      res.json(token);
     
  });

})


app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

/* const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {connect} = require("./utils/supabase");
const app = express();
app.use(express.json());
//secretToken =
const token1 = 'M+Yidu6bWMk9GKkJopL0Sk+ri/RRcBFTF5DmxvbBZaJj+ouXBWzNeSb0qf+rG0GuLXqeD34vZ0RKH2LnS+0INw==';
//token2 = 
const JWT_SECRET = 'DEE18F06FAA7F52C346E1569E13F5A85F501D844E5DD1D4DC7CA81A378A1C37A'; 
const util = require('util');
const { log } = require('console');
app.use(cors());

// Ruta protegida
app.post('/', async (req, res) =>{
  const supabase = await connect();
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autorización' });
  }
    jwt.verify(token, token1, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
      console.log('Token decodificado:', decoded);
    const correo = decoded.email;
    const contrasena = decoded.pass;
    
    const result =  await supabase.auth.signInWithPassword({
        email: correo,
        password: contrasena
     });
    const { user, error } = result;
     if (error) {
      console.log('Estamos en el error de las credenciales');
        const token = jwt.sign("Credenciales no validas", JWT_SECRET);
        res.json({token});
        return;
     } 
        /*console.log('Pasamos a las cookies');
        res.cookie('Cookie Name', 'Esta es una cookie', {
          maxAge: 100000,
          sameSite: 'lax',
        });*/
/*
        console.log(result.data.session.user.aud);
        const token = jwt.sign(result.data.session.user.aud, token1);
        res.json(token);
     
    
  });
  
});

app.post('/login', async (req, res) => {
  try {
    console.log(req.cookies);
    const token = req.headers.authorization.split(' ')[1];
    //Este es el token que viene del auth
    const decoded = jwt.verify(token, JWT_SECRET);  
    if (decoded == 'Credenciales no validas') {
      res.status(400).json({ error: 'Credenciales incorrectas' });
    } else {
      data = {aud: decoded.aud, email: decoded.email}
      loginToken = jwt.sign(data, token1);
      res.json(loginToken);  
    }
  } catch (err) {
    //res.status(600).json({ error: 'Error en el servidor' });
    const token = req.headers.authorization.split(' ')[1];
    //Este es el token que se le manda al usuario autenticado
    const decoded = jwt.verify(token, token1);
    if(decoded == 'sesion actual'){
      console.log(loginToken);
      if(!loginToken){
        const no_sesion = 'No';
        const sesionToken = jwt.sign(no_sesion, token1);
        res.json(sesionToken);
      }else {
        data = 'Sesion inciada';      
      const sesionToken = jwt.sign(loginToken, token1);
      res.json(sesionToken); 
      }
    } 
    /*data = { }
    const sesionToken = jwt.sign(data, token1);*/
/*
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});


*/
