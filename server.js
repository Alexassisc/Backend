require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const delay = require('express-delay');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const fotoRoutes = require('./routes/fotoRoutes');


app.use(delay(1000));
app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/fotos', fotoRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

sequelize
  .authenticate()
  .then(() => console.log('MySQL conectado!'))
  .catch((err) => console.log('Erro ao conectar ao MySQL:', err));

sequelize
  .sync({ alter: true })
  .then(() => console.log('Tabelas sincronizadas!'))
  .catch((err) => console.log('Erro ao sincronizar tabelas:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
