import mongoose from 'mongoose';

/**
 * Connects with the Mongo Database
 */
export async function connect() {
  await mongoose
    .connect('mongodb://localhost:27017/tUser2', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Conexao aberta');
    })
    .catch((error) => {
      console.log('Erro na conexao');
      console.log(error);
    });
}
